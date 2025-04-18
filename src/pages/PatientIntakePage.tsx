
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
import { useVoiceRecording } from '@/hooks/useVoiceRecording';

const PatientIntakePage = () => {
  const { intakeId } = useParams<{ intakeId: string }>();
  const {
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
  } = usePatientIntake();

  const { 
    isRecording, 
    startRecording, 
    stopRecording 
  } = useVoiceRecording({
    onRecordingComplete: handleRecordingComplete,
    onError: handleRecordingError
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <IntakeHeader intakeId={intakeId} />
      
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        {step === 'welcome' && <WelcomeScreen onContinue={() => setStep('consent')} />}
        {step === 'consent' && (
          <ConsentScreen
            consentGiven={consentGiven}
            onConsentChange={setConsentGiven}
            onContinue={requestMicrophoneAccess}
          />
        )}
        {step === 'conversation' && (
          <ConversationScreen
            messages={messages}
            isListening={isListening}
            isSpeaking={isSpeaking}
            isTyping={isTyping}
            onEndSession={() => setErrorDialogOpen(true)}
            onRecordingStart={startRecording}
            onRecordingStop={stopRecording}
            isRecording={isRecording}
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
              onClick={() => {
                endSession();
                if (step !== 'completed') {
                  window.location.href = "/";
                }
              }}
            >
              {step !== 'completed' ? "Exit Assessment" : "Finish"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientIntakePage;
