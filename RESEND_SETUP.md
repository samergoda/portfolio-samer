# Resend Email Setup Guide

This portfolio now uses **Resend** to handle contact form emails. Here's how to set it up:

## Step 1: Get Your Resend API Key

1. Go to [resend.com](https://resend.com)
2. Sign up or log in to your account
3. Navigate to **API Keys** in the dashboard
4. Copy your API key

## Step 2: Add Environment Variable

1. Open `.env.local` in your project root
2. Add your Resend API key:
   ```
   RESEND_API_KEY=your_api_key_here
   ```

## Step 3: Verify Your Sending Email (Important!)

**Initial Setup:** By default, Resend uses `onboarding@resend.dev` for sending. Emails will be delivered but may go to spam.

**Better Solution - Domain Setup:**

1. Go to [resend.com/domains](https://resend.com/domains)
2. Add and verify your domain
3. Update the `from` field in `/api/send-email.ts`:
   ```typescript
   from: 'noreply@yourdomain.com', // Replace with your verified domain
   ```

## Step 4: Deploy to Vercel

1. Push your changes to GitHub:

   ```bash
   git add .
   git commit -m "Add Resend email integration"
   git push
   ```

2. Connect to Vercel and add the environment variable:
   - Go to your Vercel project settings
   - Add `RESEND_API_KEY` under Environment Variables
   - Paste your Resend API key

## Step 5: Test the Form

1. Run locally: `npm run dev`
2. Visit the Contact section
3. Fill out and submit the form
4. Email will be sent to: `judosamer555@gmail.com`

## File Changes Made

- **`/api/send-email.ts`** - New API route that handles email sending
- **`src/components/sections/Contact.tsx`** - Updated form to call the API
- **`.env.local`** - Local environment variables (add your API key here)
- **`.env.example`** - Example environment variables
- **`vercel.json`** - Vercel configuration for API routes
- **`package.json`** - Added Resend dependency

## Troubleshooting

### "Failed to send email" error

- Check your Resend API key is correct
- Verify the key is in `.env.local` (for local testing)
- Verify the key is in Vercel Environment Variables (for production)

### Email goes to spam

- Use a verified domain in Resend instead of `onboarding@resend.dev`
- Add SPF and DKIM records to your domain

### API route not found

- Make sure `/api/send-email.ts` exists in the root
- Restart your dev server: `npm run dev`

## Support

- [Resend Documentation](https://resend.com/docs)
- [Vercel API Routes](https://vercel.com/docs/concepts/functions/serverless-functions)
