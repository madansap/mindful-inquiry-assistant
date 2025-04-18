import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { User, Bot, XCircle, Mic, Volume2 } from 'lucide-react';
import VoiceVisualizer from '@/components/voice/VoiceVisualizer';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

interface ConversationScreenProps {
  messages: Message[];
  isListening: boolean;
  isSpeaking: boolean;
  isTyping: boolean;
  currentUserMessage: string;
  onEndSession: () => void;
  onRecordingComplete: (text: string) => void;
  onRecordingError: (error: Error) => void;
}

export const ConversationScreen = ({
  messages,
  isListening,
  isSpeaking,
  isTyping,
  currentUserMessage,
  onEndSession,
  onRecordingComplete,
  onRecordingError,
}: ConversationScreenProps) => {
  const { isRecording, startRecording, stopRecording } = useVoiceRecording({
    onRecordingComplete,
    onError: onRecordingError,
  });

  return (
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
            onClick={onEndSession}
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
};
