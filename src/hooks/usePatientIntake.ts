
import { useState, useEffect } from 'react';
import { textToSpeech, playAudio } from '@/services/voiceService';
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
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUserMessage, setCurrentUserMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [microphoneAccess, setMicrophoneAccess] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [conversationEnded, setConversationEnded] = useState(false);

  const protocolQuestions = [
    "How have you been feeling lately?",
    "Can you tell me about any changes in your sleep patterns?",
    "Have you noticed any changes in your appetite or weight?",
    "Are you currently taking any medications?",
    "Have you ever experienced similar symptoms before?",
    "How would you describe your energy levels throughout the day?",
    "Do you ever have thoughts of harming yourself or others?",
    "How would you describe your mood on a typical day?",
    "Are there any significant stressors in your life right now?",
    "How do these symptoms affect your daily activities?",
  ];

  const handleAISpeak = async (text: string) => {
    try {
      setIsSpeaking(true);
      const audioUrl = await textToSpeech(text);
      await playAudio(audioUrl);
    } catch (error) {
      console.error('Error in AI speech:', error);
      toast({
        variant: "destructive",
        title: "Voice Error",
        description: "Failed to generate AI speech. Please try again.",
      });
    } finally {
      setIsSpeaking(false);
      
      // If this was the last question and we've finished speaking, move to completed
      if (conversationEnded) {
        setStep('completed');
      }
    }
  };

  const requestMicrophoneAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicrophoneAccess(true);
      
      const initialMessage = {
        id: Date.now().toString(),
        sender: 'assistant' as const,
        text: "Thank you for providing your consent. I'm going to ask you some questions about your mental health. Please respond honestly, and take your time. Let's start: How have you been feeling lately?",
        timestamp: new Date(),
      };
      
      setMessages([initialMessage]);
      setStep('conversation');
      
      // Clean up the stream since we only needed it for permission
      stream.getTracks().forEach(track => track.stop());
      
      // Slight delay to make the UI transition feel more natural
      setTimeout(() => {
        handleAISpeak(initialMessage.text);
      }, 500);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setErrorDialogOpen(true);
    }
  };

  const handleRecordingComplete = async (text: string) => {
    if (!text) return;
    setIsListening(false);
    
    // Update the current message with the transcribed text
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setCurrentUserMessage('');
    setIsTyping(true);
    
    // Simulate processing time for a more natural conversation flow
    setTimeout(() => {
      setIsTyping(false);
      
      const questionIndex = Math.floor(messages.length / 2);
      let nextQuestion: string;
      
      // Check if we've reached the end of our questions
      if (questionIndex >= protocolQuestions.length - 1) {
        nextQuestion = "Thank you for sharing all of this information with me. I've gathered enough information to create a comprehensive report for your healthcare provider. The assessment is now complete.";
        setConversationEnded(true); // Mark that we're at the end
      } else {
        nextQuestion = protocolQuestions[questionIndex + 1];
      }
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: nextQuestion,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      handleAISpeak(assistantMessage.text);
    }, 1000);
  };

  const handleRecordingError = (error: Error) => {
    toast({
      variant: "destructive",
      title: "Recording Error",
      description: error.message,
    });
  };

  // Start listening whenever the assistant stops speaking (unless we're ending)
  useEffect(() => {
    if (step === 'conversation' && !isSpeaking && !isListening && messages.length > 0 && !conversationEnded) {
      const lastMessage = messages[messages.length - 1];
      
      if (lastMessage.sender === 'assistant') {
        setIsListening(true);
      }
    }
  }, [step, isSpeaking, isListening, messages, conversationEnded]);

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
    handleRecordingError
  };
};
