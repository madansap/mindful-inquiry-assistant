
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FileText,
  ClipboardCheck,
  MessageSquare,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  Download,
  Share2,
  Printer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";

// Mock report data
const mockReport = {
  id: "REP-001",
  patientName: "Alex Johnson",
  patientId: "P12345",
  date: "2023-09-15",
  summary: [
    "Patient presents with moderate depressive symptoms persisting for 3+ months",
    "Reports difficulty sleeping, reduced appetite, and low energy",
    "Experiences anxiety in social situations and when thinking about work",
    "No current suicidal ideation or intent",
    "History of similar episode 2 years ago that resolved with therapy",
  ],
  symptoms: [
    { name: "Depressed mood", severity: "moderate", duration: "3+ months" },
    { name: "Sleep disturbance", severity: "moderate", duration: "3+ months" },
    { name: "Reduced appetite", severity: "mild", duration: "1 month" },
    { name: "Fatigue", severity: "severe", duration: "3+ months" },
    { name: "Social anxiety", severity: "moderate", duration: "6+ months" },
    { name: "Difficulty concentrating", severity: "mild", duration: "3+ months" },
  ],
  history: {
    psychiatric: "Previous episode of depression 2 years ago. Responded well to CBT therapy over 6 months. No psychiatric hospitalizations.",
    medical: "Hypothyroidism (controlled with medication). No other significant medical conditions.",
    medications: [
      { name: "Levothyroxine", dosage: "50mcg", frequency: "daily", duration: "3 years" }
    ],
    substance: "Reports occasional alcohol use (1-2 drinks per week). Denies tobacco or illicit drug use."
  },
  family: {
    psychiatric: "Mother with history of depression and anxiety. Maternal aunt with bipolar disorder.",
    medical: "Father with hypertension and type 2 diabetes. Paternal grandfather with Alzheimer's disease."
  },
  tests: [
    "PHQ-9 depression screening",
    "GAD-7 anxiety assessment",
    "Thyroid function tests to rule out thyroid-related mood symptoms",
    "Consider sleep study if sleep disturbances persist despite intervention"
  ],
  concerns: [
    "Worried about job performance due to concentration issues",
    "Concerned about relapse of depression",
    "Financial worries about cost of therapy"
  ],
  soapNote: {
    subjective: "Patient reports feeling 'down most days' for the past 3 months. Describes difficulty falling asleep and staying asleep, decreased appetite, and significant fatigue. Reports anxiety in social situations and when thinking about work responsibilities. Denies current suicidal ideation or intent.",
    objective: "Patient presents with flat affect, psychomotor retardation, and poor eye contact. Speech is slow but coherent. Thought process is logical and goal-directed. No evidence of psychosis. PHQ-9 score: 14 (moderate depression). GAD-7 score: 12 (moderate anxiety).",
    assessment: "Major Depressive Disorder, recurrent, moderate (F33.1). Generalized Anxiety Disorder (F41.1). Rule out thyroid contribution to mood symptoms.",
    plan: "1. Start Sertraline 50mg daily, increase to 100mg after 1 week if tolerated.\n2. Refer to CBT therapist for weekly sessions.\n3. Order thyroid function tests.\n4. Sleep hygiene education provided.\n5. Follow up in 2 weeks to assess medication response and side effects."
  },
  transcript: [
    { speaker: "assistant", text: "How have you been feeling lately?" },
    { speaker: "patient", text: "Not great, to be honest. I've been feeling down most days for the last few months. It's hard to get motivated to do things." },
    { speaker: "assistant", text: "I'm sorry to hear that. Can you tell me about your sleep patterns?" },
    { speaker: "patient", text: "Sleep has been difficult. I have trouble falling asleep and then I wake up early and can't get back to sleep. I'm tired all the time." },
    { speaker: "assistant", text: "What about your appetite? Have you noticed any changes?" },
    { speaker: "patient", text: "I'm not very hungry these days. I've lost about 5 pounds without trying." },
    { speaker: "assistant", text: "Are you currently taking any medications?" },
    { speaker: "patient", text: "Just Levothyroxine for my thyroid, 50mcg once a day. I've been on it for about 3 years." },
    { speaker: "assistant", text: "Have you experienced similar feelings before?" },
    { speaker: "patient", text: "Yes, about 2 years ago. I saw a therapist for CBT and it helped a lot. I didn't take medication that time." },
    { speaker: "assistant", text: "How would you describe your energy levels throughout the day?" },
    { speaker: "patient", text: "Very low. I feel exhausted even after sleeping. Getting through the work day is a struggle." },
    { speaker: "assistant", text: "Do you ever have thoughts of harming yourself or others?" },
    { speaker: "patient", text: "No, I don't. I feel sad but I've never thought about that." },
    { speaker: "assistant", text: "Is there a history of mental health conditions in your family?" },
    { speaker: "patient", text: "My mother has depression and anxiety. I think my aunt on my mom's side has bipolar disorder." },
    { speaker: "assistant", text: "What concerns you most about how you're feeling?" },
    { speaker: "patient", text: "I'm worried about my job. I can't concentrate and I'm falling behind. I'm also worried this will be like last time and take months to get better. And honestly, I'm concerned about the cost of therapy." },
  ]
};

const ReportViewPage = () => {
  const { reportId } = useParams<{ reportId?: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [expandedTranscript, setExpandedTranscript] = useState(false);
  
  // In a real app, fetch report data based on reportId
  const report = mockReport;
  
  return (
    <DashboardLayout>
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        
        <div>
          <h1 className="text-2xl font-bold">Patient Assessment Report</h1>
          <p className="text-muted-foreground">
            {report.patientName} • {new Date(report.date).toLocaleDateString()} • Report #{report.id}
          </p>
        </div>
        
        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm" onClick={() => {
            toast({
              title: "Report downloaded",
              description: "The report has been downloaded as a PDF.",
            });
          }}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          
          <Button variant="outline" size="sm" onClick={() => {
            toast({
              title: "Report shared",
              description: "A secure link has been created and copied to clipboard.",
            });
          }}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          
          <Button variant="outline" size="sm" onClick={() => {
            toast({
              title: "Printing report",
              description: "The report has been sent to your printer.",
            });
          }}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="summary">
            <TabsList className="mb-4">
              <TabsTrigger value="summary">
                <ClipboardCheck className="h-4 w-4 mr-2" />
                Summary
              </TabsTrigger>
              <TabsTrigger value="details">
                <FileText className="h-4 w-4 mr-2" />
                Clinical Details
              </TabsTrigger>
              <TabsTrigger value="transcript">
                <MessageSquare className="h-4 w-4 mr-2" />
                Transcript
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary" className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Summary</h2>
                <ul className="space-y-2">
                  {report.summary.map((point, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block bg-mindful-primary/10 text-mindful-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">
                        {index + 1}
                      </span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Reported Symptoms</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="pb-2 font-medium">Symptom</th>
                        <th className="pb-2 font-medium">Severity</th>
                        <th className="pb-2 font-medium">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.symptoms.map((symptom, index) => (
                        <tr key={index} className="border-b last:border-b-0">
                          <td className="py-3">{symptom.name}</td>
                          <td className="py-3">
                            <Badge className={
                              symptom.severity === "mild" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" : 
                              symptom.severity === "moderate" ? "bg-orange-100 text-orange-800 hover:bg-orange-100" : 
                              "bg-red-100 text-red-800 hover:bg-red-100"
                            }>
                              {symptom.severity}
                            </Badge>
                          </td>
                          <td className="py-3">{symptom.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Patient Concerns</h2>
                <div className="space-y-3">
                  {report.concerns.map((concern, index) => (
                    <div key={index} className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                      <p>{concern}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Recommended Tests</h2>
                <ul className="list-disc pl-5 space-y-2">
                  {report.tests.map((test, index) => (
                    <li key={index}>{test}</li>
                  ))}
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="details" className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">SOAP Note</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-lg text-mindful-primary mb-2">Subjective</h3>
                    <p className="text-gray-700">{report.soapNote.subjective}</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium text-lg text-mindful-primary mb-2">Objective</h3>
                    <p className="text-gray-700">{report.soapNote.objective}</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium text-lg text-mindful-primary mb-2">Assessment</h3>
                    <p className="text-gray-700">{report.soapNote.assessment}</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium text-lg text-mindful-primary mb-2">Plan</h3>
                    <p className="text-gray-700 whitespace-pre-line">{report.soapNote.plan}</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Patient History</h2>
                  
                  <Accordion type="multiple" className="w-full" defaultValue={["psychiatric", "medical", "medications", "substance"]}>
                    <AccordionItem value="psychiatric">
                      <AccordionTrigger className="text-sm font-medium">Psychiatric History</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-gray-700">{report.history.psychiatric}</p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="medical">
                      <AccordionTrigger className="text-sm font-medium">Medical History</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-gray-700">{report.history.medical}</p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="medications">
                      <AccordionTrigger className="text-sm font-medium">Current Medications</AccordionTrigger>
                      <AccordionContent>
                        {report.history.medications.length > 0 ? (
                          <ul className="space-y-2">
                            {report.history.medications.map((med, index) => (
                              <li key={index} className="text-sm">
                                <span className="font-medium">{med.name}</span> {med.dosage}, {med.frequency} for {med.duration}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-700">No current medications reported.</p>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="substance">
                      <AccordionTrigger className="text-sm font-medium">Substance Use</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-gray-700">{report.history.substance}</p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Family History</h2>
                  
                  <Accordion type="multiple" className="w-full" defaultValue={["family-psychiatric", "family-medical"]}>
                    <AccordionItem value="family-psychiatric">
                      <AccordionTrigger className="text-sm font-medium">Family Psychiatric History</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-gray-700">{report.family.psychiatric}</p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="family-medical">
                      <AccordionTrigger className="text-sm font-medium">Family Medical History</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-gray-700">{report.family.medical}</p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="transcript">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Conversation Transcript</h2>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setExpandedTranscript(!expandedTranscript)}
                  >
                    {expandedTranscript ? (
                      <>
                        <ChevronDown className="h-4 w-4 mr-1" />
                        Collapse All
                      </>
                    ) : (
                      <>
                        <ChevronRight className="h-4 w-4 mr-1" />
                        Expand All
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {expandedTranscript ? (
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                      {report.transcript.map((entry, index) => (
                        <div 
                          key={index}
                          className={`p-3 rounded-lg ${
                            entry.speaker === 'assistant' 
                              ? 'bg-secondary/10'
                              : 'bg-mindful-primary/10'
                          }`}
                        >
                          <div className="flex items-center mb-2">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                              entry.speaker === 'assistant'
                                ? 'bg-secondary/20 text-secondary-foreground'
                                : 'bg-mindful-primary/20 text-mindful-primary'
                            }`}>
                              {entry.speaker === 'assistant' ? 'Assistant' : 'Patient'}
                            </span>
                          </div>
                          <p className="text-sm">{entry.text}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Accordion type="single" collapsible className="w-full">
                      {report.transcript.map((entry, index) => (
                        <AccordionItem key={index} value={`q${index}`}>
                          <AccordionTrigger className={`text-sm ${
                            entry.speaker === 'assistant' ? 'font-medium' : ''
                          }`}>
                            {entry.speaker === 'assistant' ? (
                              <span>Q: {entry.text.length > 50 ? `${entry.text.substring(0, 50)}...` : entry.text}</span>
                            ) : (
                              <span className="text-mindful-primary">A: {entry.text.length > 50 ? `${entry.text.substring(0, 50)}...` : entry.text}</span>
                            )}
                          </AccordionTrigger>
                          <AccordionContent>
                            <p className={`text-sm p-3 rounded-lg ${
                              entry.speaker === 'assistant'
                                ? 'bg-secondary/10'
                                : 'bg-mindful-primary/10'
                            }`}>
                              {entry.text}
                            </p>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Patient Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">{report.patientName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Patient ID</p>
                <p className="font-medium">{report.patientId}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Assessment Date</p>
                <p className="font-medium">{new Date(report.date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Report Generated</p>
                <p className="font-medium">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Analysis</h2>
            <div>
              <h3 className="text-sm font-medium mb-2">Potential Diagnoses</h3>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span>Major Depressive Disorder</span>
                  <Badge className="bg-red-100 text-red-800 hover:bg-red-100">High</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Generalized Anxiety Disorder</span>
                  <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Medium</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Sleep Disorder</span>
                  <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Low</Badge>
                </div>
              </div>
              
              <h3 className="text-sm font-medium mb-2">Mood & Affect Analysis</h3>
              <div className="space-y-3 mb-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs">Depression Indicators</span>
                    <span className="text-xs font-medium">72%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-mindful-primary h-2 rounded-full" style={{ width: '72%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs">Anxiety Indicators</span>
                    <span className="text-xs font-medium">64%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-mindful-primary h-2 rounded-full" style={{ width: '64%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs">Risk Factors</span>
                    <span className="text-xs font-medium">37%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-mindful-primary h-2 rounded-full" style={{ width: '37%' }}></div>
                  </div>
                </div>
              </div>
              
              <h3 className="text-sm font-medium mb-2">Key Insights</h3>
              <ul className="text-sm space-y-2">
                <li className="flex items-start">
                  <span className="inline-block bg-mindful-primary/10 text-mindful-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">→</span>
                  <span>Strong family history may be contributing factor</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block bg-mindful-primary/10 text-mindful-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">→</span>
                  <span>Previous positive response to CBT suggests potential efficacy</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block bg-mindful-primary/10 text-mindful-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">→</span>
                  <span>Consider thyroid impact on current symptoms</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReportViewPage;
