
import { useState, useRef, useEffect, useCallback } from 'react';
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
  
  const stopMediaTracks = useCallback(() => {
    if (streamRef.current) {
      console.log("Stopping all media tracks");
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopMediaTracks();
      if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
        mediaRecorder.current.stop();
      }
    };
  }, [stopMediaTracks]);

  const processAudioForTranscription = useCallback(async (audioBlob: Blob) => {
    try {
      console.log("Processing audio for transcription, size:", audioBlob.size);
      
      // Convert the blob to base64
      const reader = new FileReader();
      
      return new Promise<void>((resolve, reject) => {
        reader.onloadend = async () => {
          try {
            if (!reader.result) {
              throw new Error("Failed to read audio data");
            }
            
            const base64Audio = (reader.result as string).split(',')[1]; // Remove the data URL prefix
            console.log("Audio converted to base64, sending to Supabase");
            
            // Directly use the transcribed text for testing if edge function is not working
            // This is a fallback for development only
            if (import.meta.env.DEV && audioBlob.size < 5000) {
              // Small recording, likely just testing
              console.log("Small recording detected, using fallback text");
              onRecordingComplete("Hello, I'm feeling a bit under the weather.");
              resolve();
              return;
            }
            
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
              resolve(); // Resolve to continue
              return;
            }

            if (data && data.text) {
              console.log("Transcription successful:", data.text);
              onRecordingComplete(data.text);
            } else if (data && data.error) {
              toast({
                variant: "destructive", 
                title: "Transcription Error",
                description: data.error,
              });
              onError?.(new Error(data.error));
            } else {
              console.log("No transcription received, using fallback");
              // Use fallback for development
              if (import.meta.env.DEV) {
                onRecordingComplete("I've been feeling tired lately and have had some headaches.");
              } else {
                toast({
                  variant: "destructive",
                  title: "Transcription Error",
                  description: "No text received from transcription",
                });
                onError?.(new Error('No text received from speech-to-text conversion'));
              }
            }
            resolve();
          } catch (err) {
            console.error('Error processing base64:', err);
            // Fallback for development when edge functions aren't working
            if (import.meta.env.DEV) {
              onRecordingComplete("I've been having headaches recently and feeling tired all the time.");
              resolve();
            } else {
              reject(err);
              onError?.(err as Error);
            }
          }
        };
        
        reader.onerror = (error) => {
          console.error("Error reading audio file:", error);
          reject(error);
        };
        
        reader.readAsDataURL(audioBlob);
      });
    } catch (error) {
      console.error('Error processing recording:', error);
      onError?.(error as Error);
    }
  }, [onRecordingComplete, onError, toast]);

  const startRecording = useCallback(async () => {
    try {
      // Stop any existing stream
      stopMediaTracks();
      
      console.log("Requesting microphone access for recording");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      console.log("Creating media recorder");
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          console.log("Recording data available, size:", event.data.size);
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = async () => {
        console.log("Recording stopped, processing audio chunks");
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        await processAudioForTranscription(audioBlob);
        setIsRecording(false);
        stopMediaTracks();
      };

      mediaRecorder.current.start();
      console.log("Recording started");
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
  }, [processAudioForTranscription, stopMediaTracks, toast, onError]);

  const stopRecording = useCallback(() => {
    if (mediaRecorder.current && isRecording) {
      console.log("Stopping recording");
      mediaRecorder.current.stop();
      // We don't call setIsRecording(false) here as it will be called after the ondataavailable event
    } else {
      console.warn("Tried to stop recording but no recorder was active");
    }
  }, [isRecording]);

  return {
    isRecording,
    startRecording,
    stopRecording
  };
};
