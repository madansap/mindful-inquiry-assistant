
import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  BrainCircuit, 
  Users, 
  FileText, 
  BarChartBig, 
  Settings, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  
  const navigation = [
    { name: 'Patients', href: '/dashboard', icon: Users, current: location.pathname === '/dashboard' },
    { name: 'Reports', href: '/reports', icon: FileText, current: location.pathname === '/reports' },
    { name: 'Analytics', href: '/analytics', icon: BarChartBig, current: location.pathname === '/analytics' },
    { name: 'Settings', href: '/settings', icon: Settings, current: location.pathname === '/settings' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between p-4 bg-white border-b">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mr-2"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-mindful-primary" />
            <span className="font-medium text-lg">Mindful Inquiry</span>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div 
        className={cn(
          "fixed inset-0 z-30 bg-black/50 lg:hidden transition-opacity duration-200",
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setSidebarOpen(false)}
      />
      
      <div 
        className={cn(
          "fixed top-0 left-0 z-30 w-64 h-full bg-white transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:h-screen",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col overflow-y-auto border-r border-gray-200 bg-white pt-5">
          <div className="px-6 pb-5 flex items-center">
            <BrainCircuit className="h-8 w-8 text-mindful-primary mr-2" />
            <span className="font-bold text-xl">Mindful Inquiry</span>
          </div>
          
          <div className="flex flex-grow flex-col">
            <nav className="flex-1 space-y-1 px-3 py-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-md",
                    item.current 
                      ? "bg-mindful-primary/10 text-mindful-primary" 
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5 flex-shrink-0",
                      item.current ? "text-mindful-primary" : "text-gray-400 group-hover:text-gray-600"
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="border-t border-gray-200 px-3 py-4">
            <Link to="/login" className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900">
              <LogOut className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-600" aria-hidden="true" />
              Logout
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 pt-16 lg:pt-0">
        <main className="py-8 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
