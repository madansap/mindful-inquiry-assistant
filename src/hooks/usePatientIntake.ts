
import { useState, useEffect, useCallback } from 'react';
import { useConversation, Role } from '@11labs/react';
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
  const [isTyping, setIsTyping] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);

  // Initialize ElevenLabs conversation with proper handlers
  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to ElevenLabs");
      toast({
        title: "Connected",
        description: "Voice assistant is ready",
      });
      setSessionActive(true);
    },
    onDisconnect: () => {
      console.log("Disconnected from ElevenLabs");
      if (sessionActive) {
        toast({
          title: "Disconnected",
          description: "Voice assistant session ended",
        });
      }
      setSessionActive(false);
    },
    onMessage: (props) => {
      console.log("Message received:", props);
      if (props.source === 'user' || props.source === 'ai') {
        const newMessage: Message = {
          id: Date.now().toString(),
          sender: props.source === 'user' ? 'user' : 'assistant',
          text: props.message,
          timestamp: new Date(),
        };
        
        console.log("Adding message to state:", newMessage);
        setMessages(prev => [...prev, newMessage]);
        
        if (props.source === 'ai') {
          setIsTyping(false);
        }
      }
    },
    onError: (error) => {
      console.error('Conversation error:', error);
      toast({
        variant: "destructive",
        title: "Conversation Error",
        description: error.message || "An error occurred with the voice assistant",
      });
    },
  });

  // Simplified conversation states based on ElevenLabs hook
  const isListening = conversation.status === 'connected' && !conversation.isSpeaking;
  const isSpeaking = conversation.isSpeaking;

  // Initialize conversation session with ElevenLabs
  const startConversationSession = useCallback(async () => {
    if (conversation.status !== 'connected') {
      try {
        console.log("Starting ElevenLabs session with agent ID: BUOFhT6jt80PMXtIH5Wc");
        
        await conversation.startSession({
          agentId: "BUOFhT6jt80PMXtIH5Wc",
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
        
        console.log("Session started successfully");
        setStep('conversation');
      } catch (error) {
        console.error('Failed to start session:', error);
        toast({
          variant: "destructive",
          title: "Connection Error",
          description: "Failed to connect to voice assistant. Please try again.",
        });
        setErrorDialogOpen(true);
      }
    } else {
      console.log("Session already active");
    }
  }, [conversation, toast]);

  const requestMicrophoneAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); // Release immediately after permission
      setMicrophoneAccess(true);
      
      // Initialize conversation with ElevenLabs
      await startConversationSession();
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setErrorDialogOpen(true);
    }
  };

  const handleRecordingComplete = async (text: string) => {
    if (!text.trim()) {
      console.log("Empty recording, ignoring");
      return;
    }
    
    console.log("Recording complete, sending message:", text);
    
    if (conversation.status === 'connected') {
      const userMessage: Message = {
        id: Date.now().toString(),
        sender: 'user',
        text: text,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, userMessage]);
      setIsTyping(true);
      
      try {
        console.log("Sending message to ElevenLabs");
        // Use the correct method name from the ElevenLabs API
        await conversation.sendMessage(text);
      } catch (error) {
        console.error('Error sending message:', error);
        setIsTyping(false);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to send message. Please try again.",
        });
      }
    } else {
      console.error('Cannot send message: Conversation not connected');
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "Voice assistant is not connected. Please try again.",
      });
    }
  };

  const handleRecordingError = (error: Error) => {
    console.error("Recording error:", error);
    toast({
      variant: "destructive",
      title: "Recording Error",
      description: error.message || "Failed to record audio",
    });
  };

  const endSession = useCallback(() => {
    if (conversation.status === 'connected') {
      console.log("Ending session");
      conversation.endSession();
    }
    setStep('completed');
  }, [conversation]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (conversation.status === 'connected') {
        console.log("Cleaning up: ending session on unmount");
        conversation.endSession();
      }
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
    isTyping,
    errorDialogOpen,
    setErrorDialogOpen,
    microphoneAccess,
    requestMicrophoneAccess,
    handleRecordingComplete,
    handleRecordingError,
    endSession,
  };
};
