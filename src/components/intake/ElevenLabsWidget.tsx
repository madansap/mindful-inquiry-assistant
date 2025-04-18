
import { useEffect } from 'react';

// This component is a utility wrapper for the ElevenLabs widget
// It can be used alongside or as an alternative to our custom implementation
interface ElevenLabsWidgetProps {
  agentId: string;
}

export const ElevenLabsWidget = ({ agentId }: ElevenLabsWidgetProps) => {
  useEffect(() => {
    // Load the ElevenLabs widget script if it's not already loaded
    if (!document.querySelector('script[src="https://elevenlabs.io/convai-widget/index.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://elevenlabs.io/convai-widget/index.js';
      script.async = true;
      script.type = 'text/javascript';
      document.body.appendChild(script);
    }
    
    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <div className="elevenlabs-widget-container">
      <elevenlabs-convai agent-id={agentId}></elevenlabs-convai>
    </div>
  );
};

// Usage example:
// <ElevenLabsWidget agentId="BUOFhT6jt80PMXtIH5Wc" />
