
import { useParams } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { WelcomeScreen } from '@/components/intake/WelcomeScreen';
import { ConsentScreen } from '@/components/intake/ConsentScreen';
import { ConversationScreen } from '@/components/intake/ConversationScreen';
import { CompletedScreen } from '@/components/intake/CompletedScreen';
import { IntakeHeader } from '@/components/intake/IntakeHeader';
import { usePatientIntake } from '@/hooks/usePatientIntake';
import { useState } from 'react';

const PatientIntakePage = () => {
  const { intakeId } = useParams<{ intakeId: string }>();
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  
  const {
    step,
    setStep,
    consentGiven,
    setConsentGiven,
    isListening,
    isSpeaking,
    isConnecting,
    isConnected,
    messages,
    isTyping,
    startConversation,
    endSession,
  } = usePatientIntake();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <IntakeHeader intakeId={intakeId} />
      
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        {step === 'welcome' && <WelcomeScreen onContinue={() => setStep('consent')} />}
        {step === 'consent' && (
          <ConsentScreen
            consentGiven={consentGiven}
            onConsentChange={setConsentGiven}
            onContinue={startConversation}
          />
        )}
        {step === 'conversation' && (
          <ConversationScreen
            messages={messages}
            isListening={isListening}
            isSpeaking={isSpeaking}
            isTyping={isTyping}
            isConnecting={isConnecting}
            isConnected={isConnected}
            onEndSession={() => setErrorDialogOpen(true)}
          />
        )}
        {step === 'completed' && <CompletedScreen />}
      </main>
      
      <footer className="bg-white border-t py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Mindful Inquiry Assistant. All rights reserved.
        </div>
      </footer>
      
      <Dialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>End Assessment Session?</DialogTitle>
            <DialogDescription>
              Are you sure you want to end this assessment session? Your progress will not be saved.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setErrorDialogOpen(false)}>
              Continue Session
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                endSession();
                setErrorDialogOpen(false);
              }}
            >
              End Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientIntakePage;
