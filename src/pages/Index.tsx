
import { useNavigate } from "react-router-dom";
import { BrainCircuit, ArrowRight, ShieldCheck, Stethoscope, History, Braces } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header/Navigation */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <BrainCircuit className="h-8 w-8 text-mindful-primary mr-2" />
            <span className="font-bold text-xl">Mindful Inquiry Assistant</span>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              className="text-mindful-secondary hover:text-mindful-secondary/80 hover:bg-transparent"
              onClick={() => navigate('/login')}
            >
              Log in
            </Button>
            <Button 
              className="bg-mindful-primary hover:bg-mindful-primary/90"
              onClick={() => navigate('/login')}
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4 text-mindful-secondary">
                Transforming Mental Health Intake with AI
              </h1>
              <p className="text-xl mb-8 text-gray-600">
                Streamline patient assessments with our AI-driven voice technology, delivering comprehensive mental health reports in minutes, not hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  className="bg-mindful-primary hover:bg-mindful-primary/90 text-white px-6"
                  onClick={() => navigate('/login')}
                >
                  Try it Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  className="border-mindful-primary text-mindful-primary hover:bg-mindful-primary/10"
                  onClick={() => navigate('/login')}
                >
                  Schedule a Demo
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 max-w-md mx-auto">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 rounded-full bg-mindful-primary/10 flex items-center justify-center mr-3">
                    <BrainCircuit className="h-5 w-5 text-mindful-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Mindful Inquiry Assistant</div>
                    <div className="text-sm text-gray-500">AI-Powered Mental Health Assessment</div>
                  </div>
                </div>
                <div className="space-y-4 mb-6">
                  <div className="p-3 bg-mindful-primary/10 rounded-lg">
                    <p className="text-sm font-medium">How have you been feeling lately?</p>
                  </div>
                  <div className="p-3 bg-gray-100 rounded-lg ml-6">
                    <p className="text-sm">I've been feeling quite anxious and having trouble sleeping the past few weeks.</p>
                  </div>
                  <div className="p-3 bg-mindful-primary/10 rounded-lg">
                    <p className="text-sm font-medium">Can you tell me more about your sleep patterns?</p>
                  </div>
                  <div className="p-3 bg-gray-100 rounded-lg ml-6">
                    <p className="text-sm">I find it hard to fall asleep, and when I do, I wake up frequently during the night.</p>
                  </div>
                </div>
                <div className="text-center text-sm text-gray-500">
                  Patient assessment in progress...
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-mindful-secondary">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-mindful-primary/15 flex items-center justify-center mb-4">
                <Stethoscope className="h-6 w-6 text-mindful-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Driven Interviews</h3>
              <p className="text-gray-600">
                Our AI conducts natural, protocol-based conversations with patients, adapting questions based on their responses.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-mindful-primary/15 flex items-center justify-center mb-4">
                <Braces className="h-6 w-6 text-mindful-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Analysis</h3>
              <p className="text-gray-600">
                Advanced algorithms analyze speech patterns, content, and emotional cues to extract meaningful clinical insights.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-mindful-primary/15 flex items-center justify-center mb-4">
                <History className="h-6 w-6 text-mindful-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Comprehensive Reports</h3>
              <p className="text-gray-600">
                Automatically generate detailed clinical reports with SOAP notes, observations, and recommended next steps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-mindful-secondary">Benefits for Healthcare Providers</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Our solution helps mental health professionals save time, improve patient care, and focus on what matters most.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex">
              <div className="mr-4 flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-mindful-primary/15 flex items-center justify-center">
                  <svg className="h-5 w-5 text-mindful-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Save 70% of Intake Time</h3>
                <p className="text-gray-600">
                  Reduce administrative burden and documentation time with automated interviews and report generation.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="mr-4 flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-mindful-primary/15 flex items-center justify-center">
                  <svg className="h-5 w-5 text-mindful-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Enhanced Clinical Insights</h3>
                <p className="text-gray-600">
                  Our AI identifies patterns and subtle cues that might be missed in traditional intake processes.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="mr-4 flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-mindful-primary/15 flex items-center justify-center">
                  <svg className="h-5 w-5 text-mindful-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Improved Patient Experience</h3>
                <p className="text-gray-600">
                  Patients can complete assessments from home, at their convenience, with a natural conversational interface.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="mr-4 flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-mindful-primary/15 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5 text-mindful-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Secure & Compliant</h3>
                <p className="text-gray-600">
                  End-to-end encryption and HIPAA-compliant infrastructure ensure patient data remains private and secure.
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button 
              className="bg-mindful-primary hover:bg-mindful-primary/90"
              onClick={() => navigate('/login')}
            >
              Start Your 14-Day Free Trial
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-mindful-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to transform your practice?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join the leading mental health providers using Mindful Inquiry Assistant to streamline patient intakes and improve care.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-white text-mindful-secondary hover:bg-gray-100"
              onClick={() => navigate('/login')}
            >
              Get Started
            </Button>
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white/10"
              onClick={() => navigate('/login')}
            >
              Request a Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between mb-8">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center mb-4">
                <BrainCircuit className="h-8 w-8 text-mindful-primary mr-2" />
                <span className="font-bold text-xl">Mindful Inquiry</span>
              </div>
              <p className="text-gray-400 max-w-xs">
                Transforming mental health assessments with AI-powered voice technology.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold mb-4 text-white">Product</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">Features</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Pricing</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Case Studies</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Documentation</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4 text-white">Company</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4 text-white">Legal</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">HIPAA Compliance</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Security</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 mt-8 text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} Mindful Inquiry Assistant. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
