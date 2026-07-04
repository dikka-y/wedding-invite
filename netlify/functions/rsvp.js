// netlify/functions/rsvp.js
const admin = require('firebase-admin')

let dbInitialized = false

function initFirestore() {
  if (dbInitialized) return
  const base64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64
  if (!base64) throw new Error('Missing env FIREBASE_SERVICE_ACCOUNT_BASE64')
  const json = Buffer.from(base64, 'base64').toString('utf8')
  const serviceAccount = JSON.parse(json)
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
  dbInitialized = true
}

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: JSON.stringify({ ok: false, message: 'Method Not Allowed' }) }
    }
    initFirestore()
    const data = JSON.parse(event.body || '{}')
    const doc = {
      name: data.name || null,
      email: data.email || null,
      attend: data.attend || null,
      message: data.message || null,
      guestName: data.guestName || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    }

    const write = await admin.firestore().collection('rsvps').add(doc)
    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, id: write.id })
    }
  } catch (err) {
    console.error('RSVP error:', err)
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: err.message }) }
  }
}
