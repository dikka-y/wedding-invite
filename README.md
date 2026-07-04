# Wedding Invitation — Netlify + Firebase RSVP

This branch adds a serverless Netlify function to accept RSVP submissions and store them in Firebase Firestore. It also includes a premium floral SVG asset and updates the frontend RSVP component to post to the function.

Files added/updated in this branch:

- netlify/functions/rsvp.js — Netlify serverless function using Firebase Admin SDK
- src/components/RSVP.jsx — frontend update to POST to /.netlify/functions/rsvp
- src/assets/floral-rose-premium.svg — premium SVG floral asset
- package.json — added firebase-admin dependency
- netlify.toml — Netlify configuration
- .gitignore — ensure serviceAccount.json and sensitive files are ignored

Setup instructions (short):

1. Firebase
   - Create a Firebase project and enable Firestore (Native mode).
   - Create a Service Account in Firebase Console → Project Settings → Service accounts.
   - Generate a private key (JSON) and download it as `serviceAccount.json`.
   - Do NOT commit `serviceAccount.json` to the repo.

2. Encode the service account JSON to base64
   - macOS / Linux:
     ```bash
     cat serviceAccount.json | base64 -w 0
     ```
   - Windows (PowerShell):
     ```powershell
     [Convert]::ToBase64String([IO.File]::ReadAllBytes("serviceAccount.json"))
     ```
   - Copy the resulting long base64 string.

3. Netlify
   - Create a new site in Netlify and connect it to this GitHub repo.
   - In Netlify Site Settings -> Build & deploy -> Environment -> Add variable:
     - Key: FIREBASE_SERVICE_ACCOUNT_BASE64
     - Value: (paste the base64 string)
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`

4. Local testing with Netlify CLI (optional)
   - Install netlify-cli: `npm install -g netlify-cli`
   - Export env var locally and run:
     ```bash
     export FIREBASE_SERVICE_ACCOUNT_BASE64="<base64 string>"
     netlify dev
     ```
   - The RSVP function will be available at `/.netlify/functions/rsvp`.

5. Test
   - Submit RSVP from the site or via curl:
     ```bash
     curl -X POST https://YOUR_NETLIFY_SITE.netlify.app/.netlify/functions/rsvp \
       -H "Content-Type: application/json" \
       -d '{"name":"Budi","email":"budi@example.com","attend":"yes","message":"Selamat!"}'
     ```
   - Check Firestore console for new documents in collection `rsvps`.

Security
- Keep the service account JSON secret (do not commit).
- Use Netlify environment variables for secrets.
- Consider stricter Firestore security rules if exposing read access.
