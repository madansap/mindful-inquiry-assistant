
import { Button } from '@/components/ui/button';

interface WelcomeScreenProps {
  onContinue: () => void;
}

export const WelcomeScreen = ({ onContinue }: WelcomeScreenProps) => (
  <div className="max-w-md mx-auto text-center">
    <h1 className="text-2xl font-bold mb-4">Welcome to your Mental Health Assessment</h1>
    <p className="mb-6 text-muted-foreground">
      I'm your AI assistant and I'll be guiding you through some questions to better understand your current mental health state.
    </p>
    <p className="mb-8 text-muted-foreground">
      This conversation will be recorded and analyzed to create a report for your healthcare provider.
    </p>
    <Button 
      onClick={onContinue}
      className="bg-mindful-primary hover:bg-mindful-primary/90"
    >
      Get Started
    </Button>
  </div>
);
