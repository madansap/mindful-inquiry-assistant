
import { useState, useEffect } from 'react';
import { useConversation } from '@11labs/react';
import { useToast } from '@/components/ui/use-toast';

export interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

export const usePatientIntake = () => {
  const { toast } = useToast();
  const [step, setStep] = useState<'welcome' | 'consent' | 'conversation' | 'completed'>('welcome');
  const [consentGiven, setConsentGiven] = useState(false);
  const [microphoneAccess, setMicrophoneAccess] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUserMessage, setCurrentUserMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Initialize ElevenLabs conversation
  const conversation = useConversation({
    onConnect: () => console.log("Connected to ElevenLabs"),
    onDisconnect: () => console.log("Disconnected from ElevenLabs"),
    onMessage: (message) => {
      if (message.source === 'user' || message.source === 'agent') {
        const newMessage: Message = {
          id: Date.now().toString(),
          sender: message.source === 'user' ? 'user' : 'assistant',
          text: message.message,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, newMessage]);
      }
    },
    onError: (error) => {
      console.error('Conversation error:', error);
      toast({
        variant: "destructive",
        title: "Conversation Error",
        description: error,
      });
    },
  });

  // Simplified conversation states based on ElevenLabs hook
  const isListening = conversation.status === 'connected' && !conversation.isSpeaking;
  const isSpeaking = conversation.isSpeaking;

  const requestMicrophoneAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); // Release immediately after permission
      setMicrophoneAccess(true);
      
      // Start conversation with ElevenLabs
      await conversation.startSession({
        agentId: "yOouXRA03A0kIaUUoxV5", // Agent ID provided by the user
        overrides: {
          agent: {
            prompt: {
              prompt: "You are a friendly medical intake assistant. Your goal is to gather information about the patient's condition in a conversational way. Start by asking how they've been feeling lately.",
            },
            firstMessage: "Hello! I'm here to help gather some information about your health. How have you been feeling lately?",
            language: "en",
          },
        },
      });
      
      setStep('conversation');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setErrorDialogOpen(true);
    }
  };

  const handleRecordingComplete = (text: string) => {
    // Add user's transcribed message to conversation
    conversation.sendMessage(text);
  };

  const handleRecordingError = (error: Error) => {
    toast({
      variant: "destructive",
      title: "Recording Error",
      description: error.message,
    });
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      conversation.endSession();
    };
  }, [conversation]);

  return {
    step,
    setStep,
    consentGiven,
    setConsentGiven,
    isListening,
    isSpeaking,
    messages,
    currentUserMessage,
    isTyping,
    errorDialogOpen,
    setErrorDialogOpen,
    microphoneAccess,
    requestMicrophoneAccess,
    handleRecordingComplete,
    handleRecordingError,
  };
};
