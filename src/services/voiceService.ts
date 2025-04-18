
interface VoiceConfig {
  voiceId: string;
  model: string;
}

export const defaultVoiceConfig: VoiceConfig = {
  voiceId: 'EXAVITQu4vr4xnSDxMaL', // Sarah's voice ID
  model: 'eleven_multilingual_v2',
};

export async function textToSpeech(text: string, config: VoiceConfig = defaultVoiceConfig) {
  try {
    const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + config.voiceId, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': import.meta.env.VITE_ELEVEN_LABS_API_KEY,
      },
      body: JSON.stringify({
        text,
        model_id: config.model,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to convert text to speech: ${errorText}`);
    }

    const audioBlob = await response.blob();
    return URL.createObjectURL(audioBlob);
  } catch (error) {
    console.error('Error in text to speech:', error);
    throw error;
  }
}

export function playAudio(audioUrl: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const audio = new Audio(audioUrl);
    audio.onended = () => resolve();
    audio.onerror = (error) => {
      console.error('Audio playback error:', error);
      reject(error);
    };
    audio.play().catch(reject);
  });
}
