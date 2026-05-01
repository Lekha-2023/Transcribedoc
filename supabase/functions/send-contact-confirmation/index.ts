import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Use Resend's sandbox sender until a domain is verified.
const FROM_EMAIL = "TranscribeDoc <onboarding@resend.dev>";

interface EmailRequest {
  name: string;
  email: string;
  subject?: string;
  message?: string;
  transcription?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) {
      throw new Error("RESEND_API_KEY is not configured");
    }
    const resend = new Resend(apiKey);

    const { name, email, subject, message, transcription }: EmailRequest =
      await req.json();

    if (!name || !email) {
      throw new Error("Name and email are required");
    }

    const isTranscription = !!transcription;
    console.log(
      `Processing ${isTranscription ? "transcription" : "contact"} email for ${email}`
    );

    let html: string;
    let mailSubject: string;

    if (isTranscription) {
      mailSubject = subject || "Your Transcription";
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #14b8a6;">Your TranscribeDoc Transcription</h1>
          <p>Hello ${name},</p>
          <p>Here is your requested transcription:</p>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; white-space: pre-wrap;">
            ${transcription}
          </div>
          <hr style="border: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #666; font-size: 14px;">The TranscribeDoc Team</p>
        </div>
      `;
    } else {
      if (!message) {
        throw new Error("Message is required for contact form submissions");
      }
      mailSubject = "We've received your message";
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #14b8a6;">Thank you for contacting TranscribeDoc!</h1>
          <p>Hello ${name},</p>
          <p>We've received your message regarding "${subject || ""}" and our team will review it shortly.</p>
          <p>We typically respond within 1-2 business days.</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #666; font-size: 14px;">The TranscribeDoc Team</p>
        </div>
      `;
    }

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject: mailSubject,
      html,
    });

    console.log("Resend result:", JSON.stringify(result));

    if (result.error) {
      throw new Error(
        `Failed to send email: ${result.error.message || JSON.stringify(result.error)}`
      );
    }

    return new Response(
      JSON.stringify({ success: true, id: result.data?.id }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Error processing email request:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Failed to process email request",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
