
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Mic, Volume2, User, Bot, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import VoiceVisualizer from '@/components/voice/VoiceVisualizer';
import { useToast } from '@/components/ui/use-toast';

// Conversation message type
interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

const PatientIntakePage = () => {
  const { intakeId } = useParams<{ intakeId: string }>();
  const { toast } = useToast();
  
  // State for the intake process
  const [step, setStep] = useState<'welcome' | 'consent' | 'conversation' | 'completed'>('welcome');
  const [consentGiven, setConsentGiven] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUserMessage, setCurrentUserMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [microphoneAccess, setMicrophoneAccess] = useState(false);
  
  // Mock protocol questions
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
  
  // Welcome screen
  const WelcomeScreen = () => (
    <div className="max-w-md mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Welcome to your Mental Health Assessment</h1>
      <p className="mb-6 text-muted-foreground">
        I'm your AI assistant and I'll be guiding you through some questions to better understand your current mental health state.
      </p>
      <p className="mb-8 text-muted-foreground">
        This conversation will be recorded and analyzed to create a report for your healthcare provider.
      </p>
      <Button 
        onClick={() => setStep('consent')}
        className="bg-mindful-primary hover:bg-mindful-primary/90"
      >
        Get Started
      </Button>
    </div>
  );
  
  // Consent screen
  const ConsentScreen = () => (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Please Provide Your Consent</h1>
      
      <div className="bg-secondary/10 rounded-lg p-4 mb-6">
        <h2 className="font-medium mb-2">This assessment:</h2>
        <ul className="list-disc pl-5 space-y-2 text-sm">
          <li>Will record your voice for analysis</li>
          <li>Uses AI to process your responses</li>
          <li>Creates a report for your healthcare provider</li>
          <li>Stores your information securely and confidentially</li>
          <li>Takes approximately 15-20 minutes to complete</li>
        </ul>
      </div>
      
      <div className="space-y-4 mb-6">
        <div className="flex items-center space-x-2">
          <Checkbox id="terms" checked={consentGiven} onCheckedChange={(checked) => setConsentGiven(checked === true)} />
          <Label htmlFor="terms" className="text-sm">
            I consent to the recording and processing of my voice and responses for the purpose of creating a mental health assessment report.
          </Label>
        </div>
      </div>
      
      <div className="flex justify-center">
        <Button 
          onClick={() => {
            if (consentGiven) {
              // Request microphone access
              requestMicrophoneAccess();
            } else {
              toast({
                variant: "destructive",
                title: "Consent required",
                description: "Please provide your consent to continue with the assessment.",
              });
            }
          }}
          disabled={!consentGiven}
          className="bg-mindful-primary hover:bg-mindful-primary/90"
        >
          Continue
        </Button>
      </div>
    </div>
  );
  
  // Request microphone access
  const requestMicrophoneAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Stop the stream immediately, we just needed the permission
      stream.getTracks().forEach(track => track.stop());
      
      setMicrophoneAccess(true);
      
      // Mock initial assistant message to start conversation
      const initialMessage: Message = {
        id: Date.now().toString(),
        sender: 'assistant',
        text: "Thank you for providing your consent. I'm going to ask you some questions about your mental health. Please respond honestly, and take your time. Let's start: How have you been feeling lately?",
        timestamp: new Date(),
      };
      
      setMessages([initialMessage]);
      setStep('conversation');
      simulateSpeaking(initialMessage.text);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setErrorDialogOpen(true);
    }
  };
  
  // Simulate speaking and listening
  const simulateSpeaking = (text: string) => {
    setIsSpeaking(true);
    
    // Simulate speech duration based on text length
    const duration = Math.max(2000, text.length * 40); // 40ms per character, minimum 2 seconds
    
    setTimeout(() => {
      setIsSpeaking(false);
    }, duration);
  };
  
  const simulateListening = () => {
    setIsListening(true);
    setCurrentUserMessage('');
    
    // Random duration between 3-6 seconds for user response
    const duration = 3000 + Math.random() * 3000;
    let messageText = '';
    
    // Simulate typing with a growing message
    const typingInterval = setInterval(() => {
      const responses = [
        "I've been feeling quite tired lately, and sometimes a bit down.",
        "My sleep has been interrupted. I often wake up in the middle of the night.",
        "I've noticed I don't have much appetite these days.",
        "I'm currently taking medication for my blood pressure.",
        "Yes, I've experienced similar feelings in the past, especially during winter.",
        "My energy is usually low in the morning, but gets better in the afternoon.",
        "No, I don't have thoughts of harming myself or others.",
        "Most days I feel okay, but sometimes I get unexpectedly sad or anxious.",
        "Work has been very stressful recently, and I'm worried about my finances.",
        "It's been hard to concentrate at work and I've been more irritable with my family."
      ];
      
      // Pick a random response
      messageText = responses[Math.floor(Math.random() * responses.length)];
      const progressStep = Math.floor(Math.random() * 10) + 1;
      
      // Show typing progress
      if (progressStep < messageText.length) {
        setCurrentUserMessage(messageText.substring(0, progressStep));
      }
    }, 100);
    
    setTimeout(() => {
      clearInterval(typingInterval);
      setCurrentUserMessage(messageText);
      setIsListening(false);
      
      // Add the user message to the conversation
      const userMessage: Message = {
        id: Date.now().toString(),
        sender: 'user',
        text: messageText,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      // Simulate assistant thinking
      setIsTyping(true);
      
      // After a delay, add assistant response
      setTimeout(() => {
        setIsTyping(false);
        
        // Get next question or wrap up
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: getNextQuestion(messages.length),
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        simulateSpeaking(assistantMessage.text);
      }, 2000);
      
    }, duration);
  };
  
  const getNextQuestion = (messageCount: number) => {
    // Each user response gets a follow-up question
    const questionIndex = Math.floor(messageCount / 2);
    
    if (questionIndex >= protocolQuestions.length - 1) {
      // If we've gone through all the questions, end the conversation
      setTimeout(() => {
        setStep('completed');
      }, 5000);
      
      return "Thank you for sharing all of this information with me. I've gathered enough information to create a comprehensive report for your healthcare provider. The assessment is now complete.";
    }
    
    return protocolQuestions[questionIndex + 1];
  };
  
  // Effect to handle the conversation flow
  useEffect(() => {
    if (step === 'conversation' && !isSpeaking && !isListening && messages.length > 0 && messages[messages.length - 1].sender === 'assistant') {
      // After assistant speaks, wait a bit and then listen for user response
      const timer = setTimeout(() => {
        simulateListening();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [step, isSpeaking, isListening, messages]);
  
  // Conversation screen
  const ConversationScreen = () => (
    <div className="max-w-2xl mx-auto">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${isListening || isSpeaking ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
          <span className="text-sm font-medium">
            {isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : 'Ready'}
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch id="voice-mode" defaultChecked />
            <Label htmlFor="voice-mode" className="text-sm">Voice Mode</Label>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setErrorDialogOpen(true)}
          >
            <XCircle className="h-4 w-4 mr-1" />
            End Session
          </Button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md h-[60vh] overflow-y-auto p-4 mb-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'assistant' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === 'assistant'
                    ? 'bg-secondary/20 text-secondary-foreground'
                    : 'bg-mindful-primary text-white'
                }`}
              >
                <div className="flex items-center mb-1">
                  {message.sender === 'assistant' ? (
                    <>
                      <Bot className="h-4 w-4 mr-1" />
                      <span className="text-xs font-medium">Assistant</span>
                    </>
                  ) : (
                    <>
                      <User className="h-4 w-4 mr-1" />
                      <span className="text-xs font-medium">You</span>
                    </>
                  )}
                </div>
                <p className="text-sm">{message.text}</p>
                <div className="text-xs opacity-70 text-right mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          
          {/* Current user message while typing */}
          {isListening && currentUserMessage && (
            <div className="flex justify-end">
              <div className="max-w-[80%] rounded-lg p-3 bg-mindful-primary/70 text-white">
                <div className="flex items-center mb-1">
                  <User className="h-4 w-4 mr-1" />
                  <span className="text-xs font-medium">You</span>
                </div>
                <p className="text-sm">{currentUserMessage}</p>
              </div>
            </div>
          )}
          
          {/* Assistant typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-secondary/20 text-secondary-foreground">
                <div className="flex items-center mb-1">
                  <Bot className="h-4 w-4 mr-1" />
                  <span className="text-xs font-medium">Assistant</span>
                </div>
                <p className="text-sm typing-dots">Thinking</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-center gap-6">
        <div className="flex flex-col items-center">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isListening ? 'bg-mindful-accent' : 'bg-gray-200'}`}>
            <Mic className={isListening ? 'text-mindful-secondary' : 'text-gray-400'} />
          </div>
          <VoiceVisualizer isActive={isListening} isListening={true} />
        </div>
        
        <div className="flex flex-col items-center">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isSpeaking ? 'bg-mindful-primary' : 'bg-gray-200'}`}>
            <Volume2 className={isSpeaking ? 'text-white' : 'text-gray-400'} />
          </div>
          <VoiceVisualizer isActive={isSpeaking} />
        </div>
      </div>
    </div>
  );
  
  // Completed screen
  const CompletedScreen = () => (
    <div className="max-w-md mx-auto text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckIcon className="w-8 h-8 text-green-600" />
      </div>
      <h1 className="text-2xl font-bold mb-4">Assessment Complete</h1>
      <p className="mb-6 text-muted-foreground">
        Thank you for completing your mental health assessment. Your responses have been recorded and will be analyzed to create a comprehensive report for your healthcare provider.
      </p>
      <p className="mb-8 text-muted-foreground">
        Your doctor will review the results and discuss them with you during your next appointment.
      </p>
      <Button onClick={() => window.close()} variant="outline">
        Close Window
      </Button>
    </div>
  );
  
  // CheckIcon for completion screen
  const CheckIcon = ({ className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-white border-b py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center">
            <div className="flex items-center">
              <BrainCircuitIcon className="h-8 w-8 text-mindful-primary mr-2" />
              <span className="font-bold text-xl">Mindful Inquiry</span>
            </div>
            {intakeId && (
              <div className="ml-4 px-2 py-1 bg-gray-100 rounded text-xs font-mono">
                ID: {intakeId}
              </div>
            )}
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        {step === 'welcome' && <WelcomeScreen />}
        {step === 'consent' && <ConsentScreen />}
        {step === 'conversation' && <ConversationScreen />}
        {step === 'completed' && <CompletedScreen />}
      </main>
      
      <footer className="bg-white border-t py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Mindful Inquiry Assistant. All rights reserved.
        </div>
      </footer>
      
      {/* Error Dialog */}
      <Dialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>End Assessment Session?</DialogTitle>
            <DialogDescription>
              {!microphoneAccess 
                ? "Microphone access is required for this assessment. Without it, we cannot proceed."
                : "Are you sure you want to end this assessment session? Your progress will not be saved."}
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setErrorDialogOpen(false)}>
              {!microphoneAccess ? "Try Again" : "Continue Session"}
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => window.location.href = "/"}
            >
              Exit Assessment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// BrainCircuitIcon for the header
const BrainCircuitIcon = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0-1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 2.96 3.08 2.5 2.5 0 0 0 4.91.05L12 20V4.5Z" />
    <path d="M16 8V5c0-1.1.9-2 2-2" />
    <path d="M12 13h4" />
    <path d="M12 18h6a2 2 0 0 1 2 2v1" />
    <path d="M12 8h8" />
    <path d="M20.5 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z" />
    <path d="M16.5 13a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z" />
    <path d="M20.5 21a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z" />
    <path d="M18.5 3a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z" />
  </svg>
);

export default PatientIntakePage;
