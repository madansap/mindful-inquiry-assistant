
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

    console.log("Sending audio to ElevenLabs for transcription");
    
    // Convert base64 string to binary and create form data
    const binaryStr = atob(audioBlob);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    
    // Create FormData and append the audio file
    const formData = new FormData();
    const audioFile = new Blob([bytes], { type: 'audio/webm' });
    formData.append("audio", audioFile);
    formData.append("model_id", "whisper-1");
    
    // Call ElevenLabs API
    const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
      },
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API error:', errorText);
      throw new Error(`Failed to convert speech to text: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Speech to text result:', result);
    
    return new Response(
      JSON.stringify({ text: result.text }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Voice-to-text error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
