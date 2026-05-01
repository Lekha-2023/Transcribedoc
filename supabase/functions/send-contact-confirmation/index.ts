
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@1.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// Change this to your verified domain email address for sending emails
const FROM_EMAIL = "onboarding@resend.dev"; 
// Change this to the email address where you want to receive admin notifications
const ADMIN_EMAIL = "admin@yourdomain.com"; 

interface EmailRequest {
  name: string;
  email: string;
  subject?: string;
  message?: string;
  transcription?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: EmailRequest = await req.json();

    // Server-side input validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const sanitizeHtml = (s: string) =>
      s.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    const stripHeaderInjection = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

    if (!body || typeof body !== "object") {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid request" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const rawName = typeof body.name === "string" ? body.name.trim() : "";
    const rawEmail = typeof body.email === "string" ? body.email.trim() : "";
    const rawSubject = typeof body.subject === "string" ? body.subject.trim() : "";
    const rawMessage = typeof body.message === "string" ? body.message.trim() : "";
    const rawTranscription = typeof body.transcription === "string" ? body.transcription : "";

    if (!rawName || rawName.length > 100) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid name" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    if (!rawEmail || rawEmail.length > 255 || !emailRegex.test(rawEmail)) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid email" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    if (rawSubject.length > 200) {
      return new Response(
        JSON.stringify({ success: false, error: "Subject too long" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    if (rawMessage.length > 5000) {
      return new Response(
        JSON.stringify({ success: false, error: "Message too long" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    if (rawTranscription.length > 100000) {
      return new Response(
        JSON.stringify({ success: false, error: "Transcription too long" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const name = sanitizeHtml(stripHeaderInjection(rawName));
    const email = stripHeaderInjection(rawEmail);
    const subject = sanitizeHtml(stripHeaderInjection(rawSubject));
    const message = sanitizeHtml(rawMessage);
    const transcription = rawTranscription ? sanitizeHtml(rawTranscription) : "";

    // Determine if this is a contact form submission or a transcription email
    const isTranscription = !!transcription;
    
    console.log(`Processing ${isTranscription ? 'transcription' : 'contact form'} email for ${name} (${email})`);
    
    if (isTranscription) {
      // Send transcription email to user
      const emailContent = {
        from: `MediScribe <${FROM_EMAIL}>`,
        to: email,
        subject: subject || "Your Transcription",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #14b8a6;">Your MediScribe Transcription</h1>
            <p>Hello ${name},</p>
            <p>Here is your requested transcription:</p>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; white-space: pre-wrap;">
              ${transcription}
            </div>
            <hr style="border: 1px solid #eee; margin: 20px 0;" />
            <p style="color: #666; font-size: 14px;">The MediScribe Team</p>
          </div>
        `,
      };

      const emailResult = await resend.emails.send(emailContent);
      console.log("Transcription email result:", emailResult);

      if (emailResult.error) {
        throw new Error(`Failed to send transcription email: ${emailResult.error.message}`);
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Transcription sent successfully" 
        }),
        { 
          status: 200,
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    } else {
      // This is a contact form submission
      if (!message) {
        throw new Error("Message is required for contact form submissions");
      }

      // Send confirmation email to user
      const userEmailContent = {
        from: `MediScribe <${FROM_EMAIL}>`,
        to: email,
        subject: "We've received your message",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #14b8a6;">Thank you for contacting MediScribe!</h1>
            <p>Hello ${name},</p>
            <p>We've received your message regarding "${subject}" and our team will review it shortly.</p>
            <p>We typically respond within 1-2 business days.</p>
            <hr style="border: 1px solid #eee; margin: 20px 0;" />
            <p style="color: #666; font-size: 14px;">The MediScribe Team</p>
          </div>
        `,
      };

      // Send notification email to admin
      const adminEmailContent = {
        from: `MediScribe Contact Form <${FROM_EMAIL}>`,
        to: ADMIN_EMAIL,
        subject: `New Contact Form Submission: ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #14b8a6;">New Contact Form Submission</h1>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <p><strong>From:</strong> ${name} (${email})</p>
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Message:</strong></p>
              <div style="white-space: pre-wrap;">${message}</div>
            </div>
            <hr style="border: 1px solid #eee; margin: 20px 0;" />
            <p style="color: #666; font-size: 14px;">MediScribe Contact System</p>
          </div>
        `,
      };

      // Send both emails
      const [userEmailResult, adminEmailResult] = await Promise.all([
        resend.emails.send(userEmailContent),
        resend.emails.send(adminEmailContent)
      ]);

      console.log("User confirmation email result:", userEmailResult);
      console.log("Admin notification email result:", adminEmailResult);

      if (userEmailResult.error || adminEmailResult.error) {
        throw new Error("Failed to send one or more emails");
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Contact form submitted successfully" 
        }),
        { 
          status: 200,
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }
  } catch (error) {
    console.error("Error processing email request:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "Failed to process email request. Please try again later." 
      }),
      { 
        status: 400,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  }
});
