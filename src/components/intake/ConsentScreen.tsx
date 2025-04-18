
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';

interface ConsentScreenProps {
  consentGiven: boolean;
  onConsentChange: (checked: boolean) => void;
  onContinue: () => void;
}

export const ConsentScreen = ({ consentGiven, onConsentChange, onContinue }: ConsentScreenProps) => {
  const { toast } = useToast();

  const handleContinue = () => {
    if (consentGiven) {
      onContinue();
    } else {
      toast({
        variant: "destructive",
        title: "Consent required",
        description: "Please provide your consent to continue with the assessment.",
      });
    }
  };

  return (
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
          <Checkbox 
            id="terms" 
            checked={consentGiven} 
            onCheckedChange={(checked) => onConsentChange(checked === true)} 
          />
          <Label htmlFor="terms" className="text-sm">
            I consent to the recording and processing of my voice and responses for the purpose of creating a mental health assessment report.
          </Label>
        </div>
      </div>
      
      <div className="flex justify-center">
        <Button 
          onClick={handleContinue}
          disabled={!consentGiven}
          className="bg-mindful-primary hover:bg-mindful-primary/90"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};
