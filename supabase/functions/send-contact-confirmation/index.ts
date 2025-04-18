
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@1.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const ADMIN_EMAIL = "admin@yourdomain.com"; // Replace with your admin email

interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, subject, message }: ContactRequest = await req.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      throw new Error("All fields are required");
    }

    console.log(`Processing contact form submission from ${name} (${email})`);
    
    // Send confirmation email to user
    const userEmailContent = {
      from: "MediScribe <contact@yourdomain.com>", // Use your verified domain
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
      from: "MediScribe Contact Form <contact@yourdomain.com>", // Use your verified domain
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
  } catch (error) {
    console.error("Error processing contact form:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Failed to process contact form" 
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
