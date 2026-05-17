export default {
  async fetch(request, env) {

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    };

    // Handle browser preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders
      });
    }

    // Browser test
    if (request.method !== 'POST') {
      return new Response(
        'Perfect Day AI Worker Running ✅',
        {
          headers: corsHeaders
        }
      );
    }

    try {

      const body = await request.json();

      const res = await fetch(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + env.GROQ_KEY
          },
          body: JSON.stringify(body)
        }
      );

      const data = await res.json();

      return new Response(
        JSON.stringify(data),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );

    } catch (e) {

      return new Response(
        JSON.stringify({
          error: e.toString()
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }
  }
}