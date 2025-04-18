
import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseVoiceRecordingProps {
  onRecordingComplete: (text: string) => void;
  onError?: (error: Error) => void;
}

export const useVoiceRecording = ({ onRecordingComplete, onError }: UseVoiceRecordingProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        
        try {
          // Convert the audio blob to base64
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            const base64Audio = reader.result as string;
            const base64Data = base64Audio.split(',')[1]; // Remove the data URL prefix

            // Send to our Edge Function
            const { data, error } = await supabase.functions.invoke('voice-to-text', {
              body: { audioBlob: base64Data }
            });

            if (error) {
              onError?.(new Error('Failed to convert speech to text'));
              return;
            }

            onRecordingComplete(data.text);
          };
        } catch (error) {
          onError?.(error as Error);
        } finally {
          stream.getTracks().forEach(track => track.stop());
        }
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      onError?.(error as Error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  return {
    isRecording,
    startRecording,
    stopRecording
  };
};
