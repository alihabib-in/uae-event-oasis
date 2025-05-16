
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
    console.log(`Sending approval email to ${recipientEmail} (${recipientName}) for event ${eventTitle} (${eventId})`);
    
    // Email content that would be sent
    const emailContent = `
      Dear ${recipientName},

      We are pleased to inform you that your event "${eventTitle}" has been approved and is now live on our platform.
      
      You can view your event at: ${Deno.env.get("SITE_URL")}/events/${eventId}
      
      Thank you for using our platform.
      
      Best regards,
      The Sponsorby Team
    `;
    
    console.log("Email content:", emailContent);
    
    return new Response(
      JSON.stringify({ success: true, message: "Approval email sent" }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error sending approval email:", error);
    
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
