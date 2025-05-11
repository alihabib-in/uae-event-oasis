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
      await handleBidStatusUpdate(data);
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

async function handleBidStatusUpdate(data: any) {
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
  
  // Here we would typically send the email using an email service
  // For now, we're just logging the details since this is a demo
  // In a real implementation, you would use a service like SendGrid, Mailgun, etc.
  
  // Example using a hypothetical email sending function:
  // await sendEmail({
  //   to: email,
  //   subject: subject,
  //   content: content
  // });
  
  // Return true to indicate success
  return true;
}
