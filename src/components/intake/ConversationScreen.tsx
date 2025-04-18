
import { User, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VoiceVisualizer from '@/components/voice/VoiceVisualizer';
import type { Message } from '@/hooks/usePatientIntake';

interface ConversationScreenProps {
  messages: Message[];
  isListening: boolean;
  isSpeaking: boolean;
  isTyping: boolean;
  currentUserMessage: string;
  onEndSession: () => void;
}

export const ConversationScreen = ({
  messages,
  isListening,
  isSpeaking,
  isTyping,
  currentUserMessage,
  onEndSession,
}: ConversationScreenProps) => {
  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${isListening || isSpeaking ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
          <span className="text-sm font-medium">
            {isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : 'Ready'}
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
      
      <div className="bg-white rounded-lg shadow-md h-[60vh] overflow-y-auto p-4 mb-4 message-container">
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
      
      <div className="flex justify-center">
        <VoiceVisualizer isActive={isListening || isSpeaking} isListening={isListening} />
      </div>
    </div>
  );
};
