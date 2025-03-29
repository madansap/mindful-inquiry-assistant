
import { useState } from "react";
import { 
  PlusCircle,
  Search,
  Filter,
  ChevronDown,
  Clock,
  CheckCircle2,
  AlertCircle,
  Copy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";

// Status badge component
const StatusBadge = ({ status }: { status: 'pending' | 'completed' | 'canceled' }) => {
  const statusConfig = {
    pending: {
      color: 'bg-yellow-100 text-yellow-800',
      icon: Clock
    },
    completed: {
      color: 'bg-green-100 text-green-800',
      icon: CheckCircle2
    },
    canceled: {
      color: 'bg-red-100 text-red-800',
      icon: AlertCircle
    }
  };

  const { color, icon: Icon } = statusConfig[status];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      <Icon className="mr-1 h-3 w-3" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Mock patient data
const mockPatients = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    phone: '(555) 123-4567',
    status: 'completed' as const,
    date: '2023-09-15',
    intakeId: 'INT-7823',
  },
  {
    id: '2',
    name: 'Morgan Smith',
    email: 'morgan@example.com',
    phone: '(555) 987-6543',
    status: 'pending' as const,
    date: '2023-09-18',
    intakeId: 'INT-7824',
  },
  {
    id: '3',
    name: 'Jamie Williams',
    email: 'jamie@example.com',
    phone: '(555) 456-7890',
    status: 'canceled' as const,
    date: '2023-09-16',
    intakeId: 'INT-7825',
  },
  {
    id: '4',
    name: 'Taylor Davis',
    email: 'taylor@example.com',
    phone: '(555) 789-0123',
    status: 'pending' as const,
    date: '2023-09-20',
    intakeId: 'INT-7826',
  },
  {
    id: '5',
    name: 'Jordan Miller',
    email: 'jordan@example.com',
    phone: '(555) 234-5678',
    status: 'completed' as const,
    date: '2023-09-14',
    intakeId: 'INT-7827',
  },
];

const DashboardPage = () => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState(mockPatients);
  const [patientEmail, setPatientEmail] = useState('');
  const [patientName, setPatientName] = useState('');
  const { toast } = useToast();

  const handleCreateIntake = () => {
    const newIntakeId = `INT-${Math.floor(7828 + Math.random() * 1000)}`;
    
    // Create new patient
    const newPatient = {
      id: (patients.length + 1).toString(),
      name: patientName,
      email: patientEmail,
      phone: '(555) 000-0000',
      status: 'pending' as const,
      date: new Date().toISOString().split('T')[0],
      intakeId: newIntakeId,
    };
    
    setPatients([newPatient, ...patients]);
    
    // Generate intake link
    const intakeLink = `${window.location.origin}/intake/${newIntakeId}`;
    
    // Show success toast with copy option
    toast({
      title: "Intake request created!",
      description: (
        <div className="mt-2">
          <p className="mb-2">Send this link to your patient:</p>
          <div className="flex items-center gap-2 p-2 bg-secondary/10 rounded text-xs font-mono">
            <span className="truncate">{intakeLink}</span>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6"
              onClick={() => {
                navigator.clipboard.writeText(intakeLink);
                toast({
                  title: "Link copied to clipboard",
                  duration: 2000,
                });
              }}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ),
      duration: 5000,
    });
    
    // Close dialog and reset form
    setOpen(false);
    setPatientEmail('');
    setPatientName('');
  };

  // Filter patients based on search term
  const filteredPatients = patients.filter(
    patient => 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.intakeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patient Intake Dashboard</h1>
          <p className="text-muted-foreground">Manage and track patient intake requests</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-mindful-primary hover:bg-mindful-primary/90">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Intake
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create new patient intake</DialogTitle>
              <DialogDescription>
                Enter the patient's information to generate an intake link.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Patient Name</Label>
                <Input
                  id="name"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Patient Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  placeholder="patient@example.com"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleCreateIntake}
                disabled={!patientEmail || !patientName}
                className="bg-mindful-primary hover:bg-mindful-primary/90"
              >
                Create Intake
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            placeholder="Search patients..." 
            className="pl-10" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter size={16} />
              Filter
              <ChevronDown size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setPatients([...mockPatients])}>
              All Patients
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPatients(mockPatients.filter(p => p.status === 'pending'))}>
              Pending Intakes
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPatients(mockPatients.filter(p => p.status === 'completed'))}>
              Completed Intakes
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Patients table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Intake ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                          <div className="text-sm text-gray-500">{patient.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {patient.intakeId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(patient.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={patient.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="link"
                        className="text-mindful-primary hover:text-mindful-primary/80"
                        onClick={() => {
                          if (patient.status === 'completed') {
                            // Navigate to report page in a real app
                            toast({
                              title: "Viewing report",
                              description: `Opening report for ${patient.name}`,
                            });
                          } else {
                            // Copy intake link for pending
                            const intakeLink = `${window.location.origin}/intake/${patient.intakeId}`;
                            navigator.clipboard.writeText(intakeLink);
                            toast({
                              title: "Intake link copied!",
                              description: "You can now share this with your patient.",
                            });
                          }
                        }}
                      >
                        {patient.status === 'completed' ? 'View Report' : 'Copy Link'}
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    No patients found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
