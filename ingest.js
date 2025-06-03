export async function handler(event) {
    // 1. Reject non‑POST
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }
  
    // 2. Parse form body (URL‑encoded from Netlify Forms or fetch)
    const params = new URLSearchParams(event.body);
    const email  = params.get('email') || params.get('EMAIL');
    if (!email) {
      return { statusCode: 400, body: 'Missing email' };
    }
  
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { statusCode: 400, body: 'Invalid email format' };
    }
  
    // 3. Build payload
    const payload = {
      email,
      city:   params.get('city')   || null,
      source: params.get('utm')    || 'manual',
      ts:     new Date().toISOString()
    };
  
    // 4. Fire at Supabase REST API
    const res = await fetch(`${process.env.SUPA_URL}/rest/v1/${process.env.SUPA_TABLE}`, {
      method:  'POST',
      headers: {
        apikey:        process.env.SUPA_SERVICE,
        authorization: `Bearer ${process.env.SUPA_SERVICE}`,
        'content-type': 'application/json',
        prefer:        'return=minimal'   // fast insert
      },
      body: JSON.stringify(payload)
    });
  
    if (!res.ok) {
      const errorText = await res.text();
      // Log more detailed error information for server-side inspection
      console.error(`Supabase API Error: Status ${res.status}, Body: ${errorText}, Payload: ${JSON.stringify(payload)}`);
      return { statusCode: res.status, body: `Supabase error: ${errorText}` }; // User-facing error can be simpler
    }
  
    return { statusCode: 200, body: 'OK' };
  }
  