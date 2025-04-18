
import { useState, useCallback, useEffect } from 'react';
import { useConversation } from '@11labs/react';
import { useToast } from '@/components/ui/use-toast';

export interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

// This should be stored securely in environment variables in a production app
const ELEVEN_LABS_API_KEY = ''; // Add your API key here

export const usePatientIntake = () => {
  const { toast } = useToast();
  const [step, setStep] = useState<'welcome' | 'consent' | 'conversation' | 'completed'>('welcome');
  const [consentGiven, setConsentGiven] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [apiKey, setApiKey] = useState(ELEVEN_LABS_API_KEY);

  // Initialize ElevenLabs conversation
  const conversation = useConversation({
    apiKey: apiKey, // Add API key here
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
    onMessage: (data) => {
      console.log("Message received:", data);
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: data.source === 'user' ? 'user' : 'assistant',
        text: data.message,
        timestamp: new Date(),
      };
      
      console.log("Adding message to state:", newMessage);
      setMessages(prev => [...prev, newMessage]);
      
      if (data.source === 'ai') {
        setIsTyping(false);
      }
    },
    onError: (error) => {
      console.error('Conversation error:', error);
      toast({
        variant: "destructive",
        title: "Conversation Error",
        description: error.toString(),
      });
    },
  });

  // Allow setting API key for testing purposes
  const setElevenLabsApiKey = useCallback((key: string) => {
    setApiKey(key);
  }, []);

  // Start conversation session with ElevenLabs
  const startConversation = useCallback(async () => {
    try {
      if (!apiKey) {
        toast({
          variant: "destructive",
          title: "API Key Missing",
          description: "Please provide your ElevenLabs API key to start the conversation.",
        });
        return;
      }

      console.log("Starting ElevenLabs session");
      setIsTyping(true);
      
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
      setIsTyping(false);
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "Failed to connect to voice assistant. Please try again.",
      });
    }
  }, [conversation, toast, apiKey]);

  const endSession = useCallback(() => {
    if (conversation.status === 'connected') {
      console.log("Ending session");
      conversation.endSession();
    }
    setStep('completed');
  }, [conversation]);

  return {
    step,
    setStep,
    consentGiven,
    setConsentGiven,
    messages,
    isTyping,
    isListening: conversation.status === 'connected' && !conversation.isSpeaking,
    isSpeaking: conversation.isSpeaking,
    isConnecting: conversation.status === 'connecting',
    isConnected: conversation.status === 'connected',
    startConversation,
    endSession,
    setElevenLabsApiKey,
    apiKey,
  };
};
