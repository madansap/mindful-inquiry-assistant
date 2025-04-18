
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { audioBlob } = await req.json()
    if (!audioBlob) {
      throw new Error('No audio data provided')
    }

    // Get the API key from environment
    const apiKey = Deno.env.get('ELEVEN_LABS_API_KEY')
    if (!apiKey) {
      throw new Error('Missing ElevenLabs API key')
    }

    // Convert the audio to text using Eleven Labs API
    const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'xi-api-key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        audio: audioBlob,
        model_id: "whisper-1"
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('ElevenLabs API error:', error)
      throw new Error(`Failed to convert speech to text: ${error}`)
    }

    const result = await response.json()
    console.log('Speech to text result:', result)
    
    return new Response(
      JSON.stringify({ text: result.text }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Voice-to-text error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
