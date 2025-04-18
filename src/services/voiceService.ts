
import { supabase } from '@/integrations/supabase/client';

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
    console.log('Converting text to speech:', text);
    
    const { data, error } = await supabase.functions.invoke('text-to-speech', {
      body: {
        text,
        voiceId: config.voiceId,
        model: config.model
      }
    });

    if (error) {
      console.error('Supabase function error:', error);
      throw new Error(`Failed to convert text to speech: ${error.message}`);
    }

    if (!data || !data.audio) {
      throw new Error('No audio received from text-to-speech function');
    }

    // Convert base64 to Blob
    const binaryStr = atob(data.audio);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    const audioBlob = new Blob([bytes], { type: 'audio/mpeg' });
    
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
