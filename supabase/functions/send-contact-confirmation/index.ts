
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContactRequest {
  name: string;
  email: string;
  subject: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, subject }: ContactRequest = await req.json();

    // Validate required fields
    if (!name || !email) {
      throw new Error("Name and email are required");
    }

    console.log(`Processing contact confirmation for ${name} (${email})`);

    // In a real implementation, this would send an email using a service like Resend, SendGrid, etc.
    // For this demo, we'll simulate sending an email
    
    // Mock email content
    const emailContent = {
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

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Confirmation email sent successfully" 
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
    console.error("Error sending confirmation email:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Failed to send confirmation email" 
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
