
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
    
    const { action, phone, code, tableType, recordId } = await req.json()
    
    // Determine which table to use based on the tableType
    const tableName = tableType === 'events' ? 'events' : 'bids'
    
    if (action === 'send') {
      // Generate a verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
      
      // Store the code in the database
      const { error } = await supabaseClient
        .from(tableName)
        .update({ verification_code: verificationCode })
        .eq('id', recordId)
      
      if (error) {
        throw error
      }
      
      // In a real implementation, we would send the SMS here
      // For this example, we just log the code
      console.log(`Sending code ${verificationCode} to ${phone}`)
      
      // In a real-world scenario, you would use an SMS service like Twilio:
      // const twilioResponse = await fetch('https://api.twilio.com/2010-04-01/Accounts/YOUR_ACCOUNT_SID/Messages.json', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Basic ${btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)}`,
      //     'Content-Type': 'application/x-www-form-urlencoded',
      //   },
      //   body: new URLSearchParams({
      //     To: phone,
      //     From: TWILIO_PHONE_NUMBER,
      //     Body: `Your verification code is: ${verificationCode}`
      //   })
      // });
      
      return new Response(
        JSON.stringify({ success: true, message: 'Verification code sent' }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    } else if (action === 'verify') {
      // Verify the code
      const { data, error } = await supabaseClient
        .from(tableName)
        .select('verification_code')
        .eq('id', recordId)
        .single()
      
      if (error) {
        throw error
      }
      
      if (data.verification_code === code) {
        // Mark phone as verified
        await supabaseClient
          .from(tableName)
          .update({ phone_verified: true, verification_code: null })
          .eq('id', recordId)
        
        return new Response(
          JSON.stringify({ success: true, verified: true }),
          { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        )
      } else {
        return new Response(
          JSON.stringify({ success: true, verified: false, message: 'Invalid verification code' }),
          { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        )
      }
    }
    
    return new Response(
      JSON.stringify({ success: false, message: 'Invalid action' }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 400 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 400 }
    )
  }
})
