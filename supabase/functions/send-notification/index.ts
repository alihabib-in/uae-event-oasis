
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { SMTPClient } from 'https://deno.land/x/denomailer@1.6.0/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface BidStatusNotificationData {
  brandName: string
  eventId: string
  eventName: string
  email: string
  phone: string
  bidAmount: number
  contactName: string
  status: 'approved' | 'rejected'
  adminResponse: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { type, data } = await req.json()

    if (type === 'bid_status_update') {
      const notification = data as BidStatusNotificationData
      
      // Configure SMTP client
      const client = new SMTPClient({
        connection: {
          hostname: 'smtp.gmail.com',
          port: 465,
          tls: true,
          auth: {
            username: Deno.env.get('SMTP_USERNAME') || '',
            password: Deno.env.get('SMTP_PASSWORD') || '',
          },
        },
      })

      // Create appropriate subject and message based on status
      const subject = notification.status === 'approved'
        ? `Great News! Your sponsorship bid for ${notification.eventName} has been approved`
        : `Update on your sponsorship bid for ${notification.eventName}`
      
      // Construct the email message
      let message = `<h2>Hello ${notification.contactName},</h2>`
      
      if (notification.status === 'approved') {
        message += `<p>We're pleased to inform you that your sponsorship bid for <strong>${notification.eventName}</strong> has been approved!</p>`
      } else {
        message += `<p>We've reviewed your sponsorship bid for <strong>${notification.eventName}</strong> and unfortunately, we are unable to accept it at this time.</p>`
      }

      // Add custom message from admin if provided
      if (notification.adminResponse) {
        message += `<p>Message from the event organizer:</p>
                    <p style="background-color: #f7f7f7; padding: 15px; border-left: 4px solid #007bff; font-style: italic;">${notification.adminResponse}</p>`
      }

      message += `<h3>Bid Details:</h3>
                  <ul>
                    <li><strong>Event:</strong> ${notification.eventName}</li>
                    <li><strong>Brand:</strong> ${notification.brandName}</li>
                    <li><strong>Bid Amount:</strong> AED ${notification.bidAmount.toLocaleString()}</li>
                  </ul>`
      
      // Add appropriate closing message
      if (notification.status === 'approved') {
        message += `<p>The event organizer will contact you soon to discuss next steps.</p>
                    <p>Thank you for choosing to sponsor this event!</p>`
      } else {
        message += `<p>We appreciate your interest in this event and hope you'll consider future opportunities.</p>`
      }
      
      message += `<p>Best regards,<br>The SponsorBy Team</p>`

      // Send email
      await client.send({
        from: Deno.env.get('SMTP_FROM_ADDRESS') || 'notifications@sponsorby.com',
        to: notification.email,
        subject: subject,
        html: message,
      })

      await client.close()

      return new Response(
        JSON.stringify({ success: true, message: 'Notification email sent successfully' }),
        {
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
          status: 200,
        },
      )
    }

    return new Response(
      JSON.stringify({ error: 'Invalid notification type' }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 400,
      },
    )

  } catch (error) {
    console.error('Error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 500,
      },
    )
  }
})
