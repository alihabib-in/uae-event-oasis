
// supabase/functions/send-notification/index.ts
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  // Handle OPTIONS request for CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { type, data } = await req.json();

    if (!type) {
      return new Response(JSON.stringify({ error: "Missing notification type" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get admin email addresses from settings
    const adminClient = new SmtpClient();
    
    const { data: adminSettings, error: settingsError } = await (await fetch(
      `${Deno.env.get("SUPABASE_URL")}/rest/v1/admin_settings?select=notification_emails`,
      {
        headers: {
          "Content-Type": "application/json",
          "ApiKey": Deno.env.get("SUPABASE_ANON_KEY") || "",
          "Authorization": `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
        },
      }
    )).json();

    if (settingsError || !adminSettings || adminSettings.length === 0) {
      console.error("Error fetching admin settings:", settingsError);
      throw new Error("Failed to fetch admin emails");
    }

    const adminEmails = adminSettings[0].notification_emails || ["admin@sponsorby.com"];
    
    // Configure SMTP
    await adminClient.connectTLS({
      hostname: Deno.env.get("SMTP_HOST") || "",
      port: parseInt(Deno.env.get("SMTP_PORT") || "587"),
      username: Deno.env.get("SMTP_USERNAME") || "",
      password: Deno.env.get("SMTP_PASSWORD") || "",
    });

    let emailSent = false;

    // Handle different notification types
    switch (type) {
      case "new_bid": {
        // Notify admins about new bid
        const { brandName, bidAmount, eventId, contactName, email, phone } = data;
        
        // Get event details
        const { data: eventData } = await (await fetch(
          `${Deno.env.get("SUPABASE_URL")}/rest/v1/events?id=eq.${eventId}&select=title`,
          {
            headers: {
              "Content-Type": "application/json",
              "ApiKey": Deno.env.get("SUPABASE_ANON_KEY") || "",
              "Authorization": `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
            },
          }
        )).json();
        
        const eventTitle = eventData && eventData.length > 0 ? eventData[0].title : "Unknown Event";
        
        await adminClient.send({
          from: Deno.env.get("SMTP_FROM") || "notifications@sponsorby.com",
          to: adminEmails,
          subject: `New Bid Submission: ${brandName} for ${eventTitle}`,
          content: `
            <h2>New Bid Submission</h2>
            <p>A new sponsorship bid has been submitted on the platform:</p>
            <ul>
              <li><strong>Brand:</strong> ${brandName}</li>
              <li><strong>Event:</strong> ${eventTitle}</li>
              <li><strong>Bid Amount:</strong> AED ${bidAmount.toLocaleString()}</li>
              <li><strong>Contact:</strong> ${contactName} (${email}, ${phone})</li>
            </ul>
            <p>Log in to the admin dashboard to review and respond to this bid.</p>
          `,
          html: true,
        });
        
        emailSent = true;
        break;
      }
      
      case "new_event": {
        // Notify admins about new event
        const { eventTitle, organizer, location, date } = data;
        
        await adminClient.send({
          from: Deno.env.get("SMTP_FROM") || "notifications@sponsorby.com",
          to: adminEmails,
          subject: `New Event Posted: ${eventTitle}`,
          content: `
            <h2>New Event Posted</h2>
            <p>A new event has been posted on the platform:</p>
            <ul>
              <li><strong>Event:</strong> ${eventTitle}</li>
              <li><strong>Organizer:</strong> ${organizer}</li>
              <li><strong>Location:</strong> ${location}</li>
              <li><strong>Date:</strong> ${date}</li>
            </ul>
            <p>Log in to the admin dashboard to review this event.</p>
          `,
          html: true,
        });
        
        emailSent = true;
        break;
      }
      
      case "bid_status_update": {
        // Notify brand about bid status
        const { brandName, eventName, email, bidAmount, contactName, status, adminResponse } = data;
        
        // Subject line based on status
        const subject = status === "approve" 
          ? `Good News! Your Bid for ${eventName} has been Approved` 
          : `Update on Your Bid for ${eventName}`;
        
        // Different content based on status
        const content = status === "approve" 
          ? `
            <h2>Your Sponsorship Bid Has Been Approved!</h2>
            <p>Dear ${contactName},</p>
            <p>We're pleased to inform you that your sponsorship bid for <strong>${eventName}</strong> has been approved.</p>
            <p><strong>Bid Details:</strong></p>
            <ul>
              <li><strong>Brand:</strong> ${brandName}</li>
              <li><strong>Event:</strong> ${eventName}</li>
              <li><strong>Amount:</strong> AED ${bidAmount.toLocaleString()}</li>
            </ul>
            ${adminResponse ? `<p><strong>Message from the Admin:</strong></p><p>${adminResponse}</p>` : ''}
            <p>Our team will be in touch shortly with the next steps.</p>
            <p>Thank you for using SponsorBy!</p>
          `
          : `
            <h2>Update on Your Sponsorship Bid</h2>
            <p>Dear ${contactName},</p>
            <p>We regret to inform you that your sponsorship bid for <strong>${eventName}</strong> has not been approved at this time.</p>
            <p><strong>Bid Details:</strong></p>
            <ul>
              <li><strong>Brand:</strong> ${brandName}</li>
              <li><strong>Event:</strong> ${eventName}</li>
              <li><strong>Amount:</strong> AED ${bidAmount.toLocaleString()}</li>
            </ul>
            ${adminResponse ? `<p><strong>Feedback from the Admin:</strong></p><p>${adminResponse}</p>` : ''}
            <p>We encourage you to explore other sponsorship opportunities on our platform.</p>
            <p>Thank you for using SponsorBy!</p>
          `;
        
        await adminClient.send({
          from: Deno.env.get("SMTP_FROM") || "notifications@sponsorby.com",
          to: email,
          subject,
          content,
          html: true,
        });
        
        emailSent = true;
        break;
      }
      
      default:
        throw new Error(`Unknown notification type: ${type}`);
    }

    await adminClient.close();

    if (!emailSent) {
      return new Response(JSON.stringify({ error: "Failed to send notification" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in send-notification function:", error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
