
import { Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VoiceVisualizer from '@/components/voice/VoiceVisualizer';
import type { Message } from '@/hooks/usePatientIntake';
import { useEffect, useRef } from 'react';

interface ConversationScreenProps {
  messages: Message[];
  isListening: boolean;
  isSpeaking: boolean;
  isTyping: boolean;
  isConnecting: boolean;
  isConnected: boolean;
  onEndSession: () => void;
}

export const ConversationScreen = ({
  messages,
  isListening,
  isSpeaking,
  isTyping,
  isConnecting,
  isConnected,
  onEndSession,
}: ConversationScreenProps) => {
  const messageContainerRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${isConnecting ? 'bg-yellow-500 animate-pulse' : isConnected ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          <span className="text-sm font-medium">
            {isConnecting ? 'Connecting...' : 
             !isConnected ? 'Disconnected' :
             isListening ? 'Listening...' : 
             isSpeaking ? 'Speaking...' : 
             'Ready'}
          </span>
        </div>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={onEndSession}
        >
          End Session
        </Button>
      </div>
      
      <div 
        ref={messageContainerRef}
        className="bg-white rounded-lg shadow-md h-[60vh] overflow-y-auto p-4 mb-4 space-y-4"
      >
        {messages.length === 0 && !isTyping && (
          <div className="flex justify-center items-center h-full">
            <div className="text-center text-gray-400">
              <Bot className="mx-auto h-12 w-12 mb-2" />
              <p>The assistant will start talking shortly</p>
              <p className="text-sm">Please wait...</p>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'assistant' ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.sender === 'assistant'
                  ? 'bg-secondary/20 text-secondary-foreground'
                  : 'bg-primary text-primary-foreground'
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
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-3 bg-secondary/20 text-secondary-foreground">
              <div className="flex items-center mb-1">
                <Bot className="h-4 w-4 mr-1" />
                <span className="text-xs font-medium">Assistant</span>
              </div>
              <p className="text-sm typing-dots">Thinking...</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex flex-col items-center space-y-4">
        <VoiceVisualizer isActive={isConnected && (isListening || isSpeaking)} isListening={isListening} />
        <div className="text-sm text-gray-500 text-center">
          {isConnecting ? "Connecting to voice assistant..." : 
           !isConnected ? "Voice assistant disconnected" :
           isListening ? "I'm listening. Speak now..." : 
           isSpeaking ? "I'm speaking..." : 
           "When you're ready to speak, just start talking"}
        </div>
      </div>
    </div>
  );
};
