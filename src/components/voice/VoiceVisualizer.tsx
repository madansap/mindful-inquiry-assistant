
import { useState, useEffect } from 'react';

interface VoiceVisualizerProps {
  isActive: boolean;
  isListening?: boolean;
}

const VoiceVisualizer = ({ isActive, isListening = false }: VoiceVisualizerProps) => {
  const [amplitudes, setAmplitudes] = useState<number[]>([0.3, 0.5, 0.7, 0.5, 0.3]);

  // Simulate microphone input or AI speech patterns
  useEffect(() => {
    if (!isActive) {
      setAmplitudes([0.3, 0.5, 0.7, 0.5, 0.3]); // Default state
      return;
    }

    const interval = setInterval(() => {
      const newAmplitudes = Array(5).fill(0).map(() => {
        // More animated when listening, more regular when speaking
        if (isListening) {
          return 0.3 + Math.random() * 0.7;
        } else {
          return 0.3 + (Math.sin(Date.now() / 100) + 1) * 0.35;
        }
      });
      setAmplitudes(newAmplitudes);
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, isListening]);

  return (
    <div className="voice-wave-container flex items-center justify-center gap-1 h-12">
      {amplitudes.map((amplitude, index) => (
        <div
          key={index}
          className={`voice-wave-bar ${isActive ? "animate-pulse" : ""}`}
          style={{
            height: `${amplitude * 24}px`,
            width: "4px",
            backgroundColor: isListening ? '#e9c46a' : '#2a9d8f',
            opacity: isActive ? 1 : 0.5,
            borderRadius: "1px",
          }}
        />
      ))}
    </div>
  );
};

export default VoiceVisualizer;
