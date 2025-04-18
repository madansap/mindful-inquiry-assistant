
import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface UseVoiceRecordingProps {
  onRecordingComplete: (text: string) => void;
  onError?: (error: Error) => void;
}

export const useVoiceRecording = ({ onRecordingComplete, onError }: UseVoiceRecordingProps) => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = async () => {
        try {
          const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
          
          // Convert the blob to base64
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          
          reader.onloadend = async () => {
            try {
              const base64Audio = (reader.result as string).split(',')[1]; // Remove the data URL prefix
              
              // Send to our Edge Function
              const { data, error } = await supabase.functions.invoke('voice-to-text', {
                body: { audioBlob: base64Audio }
              });

              if (error) {
                console.error('Speech-to-text error:', error);
                toast({
                  variant: "destructive",
                  title: "Transcription Error",
                  description: `Failed to convert speech to text: ${error.message}`,
                });
                onError?.(new Error(`Failed to convert speech to text: ${error.message}`));
                return;
              }

              if (data && data.text) {
                onRecordingComplete(data.text);
              } else {
                toast({
                  variant: "destructive",
                  title: "Transcription Error",
                  description: "No text received from transcription",
                });
                onError?.(new Error('No text received from speech-to-text conversion'));
              }
            } catch (err) {
              console.error('Error processing base64:', err);
              onError?.(err as Error);
            }
          };
        } catch (error) {
          console.error('Error processing recording:', error);
          onError?.(error as Error);
        }
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        variant: "destructive",
        title: "Microphone Error",
        description: "Failed to access your microphone. Please make sure it's connected and permissions are granted.",
      });
      onError?.(error as Error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      
      // Stop all tracks to release the microphone
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  };

  return {
    isRecording,
    startRecording,
    stopRecording
  };
};
