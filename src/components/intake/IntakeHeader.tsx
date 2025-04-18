
interface IntakeHeaderProps {
  intakeId?: string;
}

const BrainCircuitIcon = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0-1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 2.96 3.08 2.5 2.5 0 0 0 4.91.05L12 20V4.5Z" />
    <path d="M16 8V5c0-1.1.9-2 2-2" />
    <path d="M12 13h4" />
    <path d="M12 18h6a2 2 0 0 1 2 2v1" />
    <path d="M12 8h8" />
    <path d="M20.5 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z" />
    <path d="M16.5 13a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z" />
    <path d="M20.5 21a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z" />
    <path d="M18.5 3a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z" />
  </svg>
);

export const IntakeHeader = ({ intakeId }: IntakeHeaderProps) => (
  <header className="bg-white border-b py-4">
    <div className="container mx-auto px-4">
      <div className="flex items-center">
        <div className="flex items-center">
          <BrainCircuitIcon className="h-8 w-8 text-mindful-primary mr-2" />
          <span className="font-bold text-xl">Mindful Inquiry</span>
        </div>
        {intakeId && (
          <div className="ml-4 px-2 py-1 bg-gray-100 rounded text-xs font-mono">
            ID: {intakeId}
          </div>
        )}
      </div>
    </div>
  </header>
);
