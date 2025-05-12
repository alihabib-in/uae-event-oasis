
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

// CORS headers for browser compatibility
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Get the request body
    const body = await req.json();
    const { type, data } = body;
    
    // Get Supabase client using environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Handle different notification types
    if (type === 'bid_status_update') {
      console.log(`Processing bid_status_update notification`);
      await handleBidStatusUpdate(data, supabase);
    } else if (type === 'event_submission') {
      console.log(`Processing event_submission notification`);
      await handleEventSubmission(data, supabase);
    } else if (type === 'bid_submission') {
      console.log(`Processing bid_submission notification`);
      await handleBidSubmission(data, supabase);
    } else {
      throw new Error(`Unsupported notification type: ${type}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error(`Error in notification function:`, error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});

async function handleBidStatusUpdate(data: any, supabase: any) {
  const { 
    brandName, 
    eventName, 
    email, 
    bidAmount, 
    contactName, 
    status, 
    adminResponse 
  } = data;
  
  console.log(`Sending bid status update email to bidder at: ${email}`);
  
  // Create email subject based on status
  const subject = status === 'approved' 
    ? "Your SponsorBy Bid Has Been Approved"
    : "Your SponsorBy Bid Has Been Rejected";
  
  // Create email content based on status
  let content = '';
  if (status === 'approved') {
    content = `
      Dear ${contactName},
      
      We are writing to inform you that your sponsorship bid for the event "${eventName}" has been approved.
      
      ${adminResponse ? `\nMessage from the SponsorBy Team:\n${adminResponse}\n` : ''}
      
      Bid Details:
      - Brand: ${brandName}
      - Event: ${eventName}
      - Bid Amount: AED ${Number(bidAmount).toLocaleString()}
      
      Our team will contact you soon with next steps for finalizing the sponsorship arrangement.
      
      Best regards,
      The SponsorBy Team
    `;
  } else {
    content = `
      Dear ${contactName},
      
      We regret to inform you that your sponsorship bid for the event "${eventName}" has been rejected.
      
      ${adminResponse ? `\nMessage from the SponsorBy Team:\n${adminResponse}\n` : ''}
      
      Bid Details:
      - Brand: ${brandName}
      - Event: ${eventName}
      - Bid Amount: AED ${Number(bidAmount).toLocaleString()}
      
      We appreciate your interest and hope to work with you on future opportunities.
      
      Best regards,
      The SponsorBy Team
    `;
  }
  
  console.log(`Subject: ${subject}`);
  console.log(`Content: ${content}`);
  console.log(`Status: ${status}, Custom response: ${adminResponse}`);
  
  // Get admin settings to find notification emails
  const { data: adminSettings } = await supabase
    .from('admin_settings')
    .select('notification_emails')
    .single();
    
  if (adminSettings && adminSettings.notification_emails) {
    // Send notification to all admin emails
    console.log(`Sending notification to admins: ${adminSettings.notification_emails.join(', ')}`);
    
    // In a real implementation, you would send admin notification emails here
  }
  
  // Here we would typically send the email using an email service
  // For now, we're just logging the details since this is a demo
  // In a real implementation, you would use a service like SendGrid, Mailgun, etc.
  
  // Return true to indicate success
  return true;
}

async function handleEventSubmission(data: any, supabase: any) {
  const {
    eventId,
    eventName,
    organizerName,
    organizerEmail,
    organizerPhone
  } = data;
  
  console.log(`Processing event submission notification for: ${eventName}`);
  
  // Get admin settings to find notification emails
  const { data: adminSettings } = await supabase
    .from('admin_settings')
    .select('notification_emails')
    .single();
    
  if (adminSettings && adminSettings.notification_emails) {
    // Send notification to all admin emails
    console.log(`Sending event submission notification to admins: ${adminSettings.notification_emails.join(', ')}`);
    
    const adminSubject = `New Event Submission: ${eventName}`;
    const adminContent = `
      Dear Admin,
      
      A new event has been submitted to SponsorBy:
      
      Event Name: ${eventName}
      Organizer: ${organizerName}
      Contact: ${organizerEmail} / ${organizerPhone}
      
      Please review this submission on the admin dashboard.
      
      - SponsorBy Platform
    `;
    
    console.log(`Admin Subject: ${adminSubject}`);
    console.log(`Admin Content: ${adminContent}`);
    
    // In a real implementation, you would send emails to all admin emails here
  }
  
  return true;
}

async function handleBidSubmission(data: any, supabase: any) {
  const {
    bidId,
    eventName,
    brandName,
    contactName,
    contactEmail,
    bidAmount
  } = data;
  
  console.log(`Processing bid submission notification for: ${brandName} on ${eventName}`);
  
  // Get admin settings to find notification emails
  const { data: adminSettings } = await supabase
    .from('admin_settings')
    .select('notification_emails')
    .single();
    
  if (adminSettings && adminSettings.notification_emails) {
    // Send notification to all admin emails
    console.log(`Sending bid submission notification to admins: ${adminSettings.notification_emails.join(', ')}`);
    
    const adminSubject = `New Sponsorship Bid: ${brandName} for ${eventName}`;
    const adminContent = `
      Dear Admin,
      
      A new sponsorship bid has been submitted to SponsorBy:
      
      Event: ${eventName}
      Brand: ${brandName}
      Contact: ${contactName} (${contactEmail})
      Bid Amount: AED ${Number(bidAmount).toLocaleString()}
      
      Please review this bid on the admin dashboard.
      
      - SponsorBy Platform
    `;
    
    console.log(`Admin Subject: ${adminSubject}`);
    console.log(`Admin Content: ${adminContent}`);
    
    // In a real implementation, you would send emails to all admin emails here
  }
  
  return true;
}
