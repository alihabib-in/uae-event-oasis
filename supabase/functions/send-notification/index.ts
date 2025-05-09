
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_ANON_KEY') || ''
    )
    
    const { type, data } = await req.json()
    
    // Get admin emails from settings
    const { data: adminSettings, error: settingsError } = await supabaseClient
      .from('admin_settings')
      .select('notification_emails')
      .limit(1)
      .single()
    
    if (settingsError) {
      throw settingsError
    }
    
    const notificationEmails = adminSettings.notification_emails || ['admin@sponsorby.com']
    
    // In a real-world scenario, you would send emails here using a service like SendGrid or Resend
    console.log(`Sending ${type} notification to:`, notificationEmails)
    console.log('Notification data:', data)
    
    // Example of using an email service (commented out):
    // const emailResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${SENDGRID_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     personalizations: notificationEmails.map(email => ({
    //       to: [{ email }],
    //       subject: `New ${type} submission on Sponsorby`
    //     })),
    //     from: { email: 'notifications@sponsorby.com', name: 'Sponsorby Notifications' },
    //     content: [{ type: 'text/html', value: `<h1>New ${type} submission</h1><pre>${JSON.stringify(data, null, 2)}</pre>` }]
    //   })
    // });
    
    return new Response(
      JSON.stringify({ success: true, message: 'Notification sent' }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 400 }
    )
  }
})
