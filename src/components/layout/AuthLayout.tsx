
import { ReactNode } from "react";
import { BrainCircuit } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - branding */}
      <div className="hidden md:flex md:w-1/2 bg-mindful-primary p-8 justify-center items-center">
        <div className="max-w-md text-center">
          <div className="mb-6 mx-auto w-24 h-24 rounded-full bg-white/10 flex items-center justify-center">
            <BrainCircuit className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Mindful Inquiry Assistant</h1>
          <p className="text-lg text-white/80">
            Streamlining mental health intake through AI-assisted patient interviews and comprehensive reporting.
          </p>
        </div>
      </div>
      
      {/* Right side - auth content */}
      <div className="flex-1 flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="md:hidden mb-6 mx-auto w-16 h-16 rounded-full bg-mindful-primary/10 flex items-center justify-center">
              <BrainCircuit className="h-8 w-8 text-mindful-primary" />
            </div>
            <h2 className="text-2xl font-bold text-mindful-dark mb-2">{title}</h2>
            {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
