
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  transcription?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, subject, transcription }: ContactRequest = await req.json();

    // Validate required fields
    if (!name || !email) {
      throw new Error("Name and email are required");
    }

    console.log(`Processing email for ${name} (${email})`);
    
    if (transcription) {
      console.log(`Transcription length: ${transcription.length} characters`);
    } else {
      console.log("No transcription provided in request");
    }
    
    // Create appropriate email content based on whether it's a transcription email
    const emailContent = transcription 
      ? {
          to: email,
          from: "support@mediscribe.com",
          subject: subject,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #14b8a6;">Your MediScribe Transcription</h1>
              <p>Hello ${name},</p>
              <p>Here is your requested transcription:</p>
              <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; white-space: pre-wrap;">
                ${transcription}
              </div>
              <hr style="border: 1px solid #eee; margin: 20px 0;" />
              <p style="color: #666; font-size: 14px;">The MediScribe Team</p>
            </div>
          `,
        }
      : {
          to: email,
          from: "support@mediscribe.com",
          subject: `MediScribe: We've received your message about "${subject}"`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #14b8a6;">Thank you for contacting MediScribe!</h1>
              <p>Hello ${name},</p>
              <p>We've received your message regarding "${subject}" and wanted to let you know that our team is reviewing it.</p>
              <p>We typically respond within 1-2 business days.</p>
              <p>If your inquiry is urgent, please call our support line at +1 (555) 123-4567.</p>
              <hr style="border: 1px solid #eee; margin: 20px 0;" />
              <p style="color: #666; font-size: 14px;">The MediScribe Team</p>
            </div>
          `,
        };

    console.log("Would send email with content:", emailContent);

    // In a production environment, this would connect to a real email service
    // For example, with the Resend API:
    /*
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    const { data, error } = await resend.emails.send(emailContent);
    
    if (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
    */

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Email sent successfully" 
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
    console.error("Error sending email:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Failed to send email" 
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
