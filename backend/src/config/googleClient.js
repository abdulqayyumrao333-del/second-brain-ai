import { google } from 'googleapis'

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
} = process.env

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI) {
  console.warn(
    '[googleClient] Google OAuth env vars are missing — /api/gmail routes will fail until set.'
  )
}

export const GMAIL_SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']

export function createOAuthClient() {
  return new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI
  )
}