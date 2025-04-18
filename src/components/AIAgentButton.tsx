
import React, { useState } from 'react';
import { Mic } from 'lucide-react';
import { usePatientIntake } from '@/hooks/usePatientIntake';

interface AIAgentButtonProps {
  className?: string;
}

export const AIAgentButton: React.FC<AIAgentButtonProps> = ({ className }) => {
  const { startConversation, isConnecting, isConnected } = usePatientIntake();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    startConversation();
  };

  return (
    <div 
      className={`relative group cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Gradient Background */}
      <div 
        className={`absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 opacity-80 
        transition-all duration-300 ease-in-out 
        ${isHovered ? 'scale-105 blur-md' : 'blur-lg'}`}
      />
      
      {/* Button Content */}
      <div 
        className={`relative z-10 w-48 h-48 rounded-full flex items-center justify-center 
        bg-gradient-to-r from-blue-500/30 via-blue-400/30 to-blue-600/30 
        border-2 border-blue-500/50 
        transition-all duration-300 ease-in-out
        ${isHovered ? 'scale-105 shadow-2xl' : ''}`}
      >
        <div className="flex flex-col items-center">
          <Mic 
            className={`w-12 h-12 
            ${isConnecting ? 'text-yellow-400 animate-pulse' : 
              isConnected ? 'text-green-400' : 'text-blue-300'}`} 
          />
          <span className="mt-2 text-white font-medium text-lg">
            {isConnecting ? 'Connecting...' : 
             isConnected ? 'Connected' : 
             'Call AI Agent'}
          </span>
        </div>
      </div>
    </div>
  );
};
