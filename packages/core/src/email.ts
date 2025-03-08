import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2'
import { Resource } from 'sst'

export namespace Email {
  export const client = new SESv2Client({})

  export async function send(from: string, to: string, subject: string, body: string) {
    from = from + '@' + Resource.Email.sender
    console.log('sending email', subject, from, to)
    try {
      await client.send(
        new SendEmailCommand({
          Destination: {
            ToAddresses: [to],
          },
          Content: {
            Simple: {
              Body: {
                Text: {
                  Data: body,
                },
              },
              Subject: {
                Data: subject,
              },
            },
          },
          FromEmailAddress: `Briefer <${from}>`,
        })
      )
    } catch (error: any) {
      console.error('failed to send email:', error)
      throw new Error(error)
    }
  }
}
