
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

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
      throw settingsError;
    }
    
    const notificationEmails = adminSettings.notification_emails;
    
    // In a real implementation, you would send the email here using a service like SendGrid or similar
    console.log(`Sending notification emails to ${notificationEmails.join(', ')}`);
    
    if (type === 'event') {
      console.log(`New event submission: ${data.eventName} by ${data.organizerName}`);
      // Send event notification email
      // In a real implementation, this is where you'd make an API call to your email service
      console.log(`Event notification content: 
        Event: ${data.eventName}
        Organizer: ${data.organizerName}
        Contact: ${data.organizerEmail}, ${data.organizerPhone}
      `);
    } 
    else if (type === 'bid') {
      console.log(`New bid submission: ${data.brandName} for event ID ${data.eventId}`);
      // Send bid notification email to admin
      console.log(`Bid notification content: 
        Brand: ${data.brandName}
        Event ID: ${data.eventId}
        Contact: ${data.email}, ${data.phone}
        Bid Amount: ${data.bidAmount}
      `);
      
      // Send confirmation email to bidder
      if (data.email) {
        // In a real implementation, this would use an email service API
        console.log(`Sending confirmation email to bidder at: ${data.email}
          Subject: Your SponsorBy Bid Submission
          Content:
          Dear ${data.contactName},
          
          Thank you for submitting your sponsorship bid for the event. Our team has received your submission and will review it promptly.
          
          Bid Details:
          - Brand: ${data.brandName}
          - Event: ${data.eventId}
          - Bid Amount: AED ${data.bidAmount}
          
          We will be in touch with you shortly regarding next steps.
          
          Best regards,
          The SponsorBy Team
        `);
      }
    }
    
    return new Response(
      JSON.stringify({ success: true, message: 'Notification sent' }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
    
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 400 }
    );
  }
});
