
import { Button } from '@/components/ui/button';

export const CompletedScreen = () => (
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

const CheckIcon = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);
