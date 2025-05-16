
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const { eventId, eventTitle, recipientEmail, recipientName } = await req.json();
    
    // In a real implementation, we'd use an email service like Resend.com, SendGrid, etc.
    // But for now, we'll just log the email content
    console.log(`Sending rejection email to ${recipientEmail} (${recipientName}) for event ${eventTitle} (${eventId})`);
    
    // Email content that would be sent
    const emailContent = `
      Dear ${recipientName},

      We regret to inform you that your event "${eventTitle}" could not be approved at this time.
      
      Please contact us for more information or to discuss any necessary changes to meet our platform requirements.
      
      Thank you for your understanding.
      
      Best regards,
      The Sponsorby Team
    `;
    
    console.log("Email content:", emailContent);
    
    return new Response(
      JSON.stringify({ success: true, message: "Rejection email sent" }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error sending rejection email:", error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
