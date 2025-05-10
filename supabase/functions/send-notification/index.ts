
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Email templates organized by notification type
const emailTemplates = {
  event: (data: any) => ({
    subject: `New Event Submission: ${data.eventName}`,
    adminContent: `
      New Event Submission Details:
      
      Event: ${data.eventName}
      Organizer: ${data.organizerName}
      Contact: ${data.organizerEmail}, ${data.organizerPhone}
      
      Please log in to the admin panel to review this submission.
    `
  }),
  
  bid: (data: any) => ({
    subject: `New Sponsorship Bid: ${data.brandName}`,
    adminContent: `
      New Sponsorship Bid Details:
      
      Brand: ${data.brandName}
      Event ID: ${data.eventId}
      Contact: ${data.email}, ${data.phone}
      Bid Amount: AED ${data.bidAmount}
      
      Please log in to the admin panel to review this submission.
    `,
    bidderSubject: "Your SponsorBy Bid Submission",
    bidderContent: `
      Dear ${data.contactName},
      
      Thank you for submitting your sponsorship bid for the event. Our team has received your submission and will review it promptly.
      
      Bid Details:
      - Brand: ${data.brandName}
      - Event ID: ${data.eventId}
      - Bid Amount: AED ${data.bidAmount}
      
      We will be in touch with you shortly regarding next steps.
      
      Best regards,
      The SponsorBy Team
    `
  }),
  
  bid_status_update: (data: any) => ({
    bidderSubject: `Your SponsorBy Bid Has Been ${data.status === 'approved' ? 'Approved' : 'Rejected'}`,
    bidderContent: `
      Dear ${data.contactName},
      
      We are writing to inform you that your sponsorship bid for the event "${data.eventName}" has been ${data.status === 'approved' ? 'approved' : 'rejected'}.
      
      ${data.adminResponse ? `\nMessage from the SponsorBy Team:\n${data.adminResponse}\n` : ''}
      
      Bid Details:
      - Brand: ${data.brandName}
      - Event: ${data.eventName}
      - Bid Amount: AED ${data.bidAmount}
      
      ${data.status === 'approved' 
        ? 'Our team will contact you soon with next steps for finalizing the sponsorship arrangement.' 
        : 'We appreciate your interest and hope you will consider other sponsorship opportunities in the future.'}
      
      Best regards,
      The SponsorBy Team
    `
  })
};

// Function to send notifications
async function sendNotification(type: string, data: any, notificationEmails: string[]) {
  // Log the notification
  console.log(`Processing ${type} notification`);
  
  if (type === "event") {
    const template = emailTemplates.event(data);
    console.log(`Sending event notification emails to ${notificationEmails.join(', ')}`);
    console.log(`Subject: ${template.subject}`);
    console.log(`Content: ${template.adminContent}`);
    
    // In a real implementation, you would call an email service API here
  } 
  else if (type === "bid") {
    const template = emailTemplates.bid(data);
    
    // Send admin notification
    console.log(`Sending bid notification emails to ${notificationEmails.join(', ')}`);
    console.log(`Subject: ${template.subject}`);
    console.log(`Content: ${template.adminContent}`);
    
    // Send confirmation email to bidder if email provided
    if (data.email) {
      console.log(`Sending confirmation email to bidder at: ${data.email}`);
      console.log(`Subject: ${template.bidderSubject}`);
      console.log(`Content: ${template.bidderContent}`);
      
      // In a real implementation, you would call an email service API here
    }
  }
  else if (type === "bid_status_update") {
    const template = emailTemplates.bid_status_update(data);
    
    // Send status update email to bidder
    if (data.email) {
      console.log(`Sending bid status update email to bidder at: ${data.email}`);
      console.log(`Subject: ${template.bidderSubject}`);
      console.log(`Content: ${template.bidderContent}`);
      console.log(`Status: ${data.status}, Custom response: ${data.adminResponse || 'None provided'}`);
      
      // In a real implementation, you would call an email service API here
    }
  }
  
  return true;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_ANON_KEY') || ''
    );
    
    const { type, data } = await req.json();
    
    // Get admin email settings
    const { data: adminSettings, error: settingsError } = await supabaseClient
      .from('admin_settings')
      .select('notification_emails')
      .single();
    
    if (settingsError) {
      console.error('Error fetching admin settings:', settingsError);
      throw settingsError;
    }
    
    const notificationEmails = adminSettings.notification_emails;
    
    // Process the notification based on type
    await sendNotification(type, data, notificationEmails);
    
    return new Response(
      JSON.stringify({ success: true, message: 'Notification sent' }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
    
  } catch (error) {
    console.error('Error in send-notification function:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 400 }
    );
  }
});
