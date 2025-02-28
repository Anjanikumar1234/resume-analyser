
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Users, FileText, Settings, LogOut, 
  BarChart, PieChart, TrendingUp, Search,
  UserCog, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

// Mock data for admin dashboard
const mockUsers = [
  { id: "1", name: "John Smith", email: "john@example.com", resumes: 3, lastActive: "2023-07-15" },
  { id: "2", name: "Sarah Johnson", email: "sarah@example.com", resumes: 5, lastActive: "2023-07-14" },
  { id: "3", name: "Michael Brown", email: "michael@example.com", resumes: 2, lastActive: "2023-07-12" },
  { id: "4", name: "Emily Davis", email: "emily@example.com", resumes: 1, lastActive: "2023-07-10" },
  { id: "5", name: "Robert Wilson", email: "robert@example.com", resumes: 4, lastActive: "2023-07-08" },
];

const mockResumes = [
  { id: "1", user: "John Smith", title: "Software Developer Resume", date: "2023-07-15", score: 82 },
  { id: "2", user: "Sarah Johnson", title: "Marketing Specialist Resume", date: "2023-07-14", score: 78 },
  { id: "3", user: "Michael Brown", title: "Data Analyst Resume", date: "2023-07-13", score: 85 },
  { id: "4", user: "Emily Davis", title: "Graphic Designer Resume", date: "2023-07-12", score: 75 },
  { id: "5", user: "Robert Wilson", title: "Project Manager Resume", date: "2023-07-11", score: 89 },
];

const AdminPanel = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter functions
  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredResumes = mockResumes.filter(resume => 
    resume.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    resume.user.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  useEffect(() => {
    // Check if user is logged in as admin
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }
    
    const userData = JSON.parse(storedUser);
    if (userData.role !== "admin") {
      toast.error("You don't have access to this page");
      navigate("/dashboard");
      return;
    }
    
    setUser(userData);
  }, [navigate]);
  
  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };
  
  if (!user) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="hidden md:flex flex-col w-64 bg-card cyber-border rounded-r-xl shadow-lg overflow-hidden"
      >
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold gradient-text">Admin Panel</h2>
        </div>
        
        <div className="flex-1 py-6">
          <nav className="space-y-1 px-3">
            <Button
              variant={activeTab === "dashboard" ? "default" : "ghost"}
              className="w-full justify-start mb-1"
              onClick={() => setActiveTab("dashboard")}
            >
              <BarChart className="w-5 h-5 mr-3" />
              Dashboard
            </Button>
            
            <Button
              variant={activeTab === "users" ? "default" : "ghost"}
              className="w-full justify-start mb-1"
              onClick={() => setActiveTab("users")}
            >
              <Users className="w-5 h-5 mr-3" />
              Users
            </Button>
            
            <Button
              variant={activeTab === "resumes" ? "default" : "ghost"}
              className="w-full justify-start mb-1"
              onClick={() => setActiveTab("resumes")}
            >
              <FileText className="w-5 h-5 mr-3" />
              Resumes
            </Button>
            
            <Button
              variant={activeTab === "settings" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="w-5 h-5 mr-3" />
              Settings
            </Button>
          </nav>
        </div>
        
        <div className="p-4 border-t">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="font-medium">Admin</div>
              <div className="text-xs text-muted-foreground">{user.email}</div>
            </div>
          </div>
          
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </motion.div>
      
      {/* Mobile navigation tabs */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t p-2">
        <div className="flex justify-between">
          <button
            className={`flex flex-col items-center p-2 ${
              activeTab === "dashboard" ? "text-primary" : "text-muted-foreground"
            }`}
            onClick={() => setActiveTab("dashboard")}
          >
            <BarChart className="w-5 h-5" />
            <span className="text-xs mt-1">Dashboard</span>
          </button>
          
          <button
            className={`flex flex-col items-center p-2 ${
              activeTab === "users" ? "text-primary" : "text-muted-foreground"
            }`}
            onClick={() => setActiveTab("users")}
          >
            <Users className="w-5 h-5" />
            <span className="text-xs mt-1">Users</span>
          </button>
          
          <button
            className={`flex flex-col items-center p-2 ${
              activeTab === "resumes" ? "text-primary" : "text-muted-foreground"
            }`}
            onClick={() => setActiveTab("resumes")}
          >
            <FileText className="w-5 h-5" />
            <span className="text-xs mt-1">Resumes</span>
          </button>
          
          <button
            className={`flex flex-col items-center p-2 ${
              activeTab === "settings" ? "text-primary" : "text-muted-foreground"
            }`}
            onClick={() => setActiveTab("settings")}
          >
            <Settings className="w-5 h-5" />
            <span className="text-xs mt-1">Settings</span>
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex-1 p-8 md:p-10 pb-20 md:pb-10 overflow-auto"
      >
        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <div>
            <h1 className="text-3xl font-bold mb-8 gradient-text">Admin Dashboard</h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-card cyber-border rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Total Users</h3>
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <p className="text-3xl font-bold mt-2">{mockUsers.length}</p>
                <p className="text-sm text-muted-foreground mt-1">+12% from last month</p>
              </div>
              
              <div className="bg-card cyber-border rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Resumes Analyzed</h3>
                  <FileText className="w-6 h-6 text-secondary" />
                </div>
                <p className="text-3xl font-bold mt-2">{mockResumes.length}</p>
                <p className="text-sm text-muted-foreground mt-1">+18% from last month</p>
              </div>
              
              <div className="bg-card cyber-border rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Avg. Score</h3>
                  <PieChart className="w-6 h-6 text-accent" />
                </div>
                <p className="text-3xl font-bold mt-2">82%</p>
                <p className="text-sm text-muted-foreground mt-1">+5% from last month</p>
              </div>
              
              <div className="bg-card cyber-border rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Active Users</h3>
                  <TrendingUp className="w-6 h-6 text-green-500" />
                </div>
                <p className="text-3xl font-bold mt-2">78%</p>
                <p className="text-sm text-muted-foreground mt-1">+8% from last month</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-card cyber-border rounded-xl p-6">
                <h3 className="text-lg font-medium mb-4">Recent Users</h3>
                <div className="space-y-4">
                  {mockUsers.slice(0, 5).map((user, index) => (
                    <div key={user.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <UserCog className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-xs text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(user.lastActive).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-card cyber-border rounded-xl p-6">
                <h3 className="text-lg font-medium mb-4">Recent Resumes</h3>
                <div className="space-y-4">
                  {mockResumes.slice(0, 5).map((resume) => (
                    <div key={resume.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                          <FileText className="w-5 h-5 text-secondary" />
                        </div>
                        <div>
                          <div className="font-medium">{resume.title}</div>
                          <div className="text-xs text-muted-foreground">by {resume.user}</div>
                        </div>
                      </div>
                      <div className="text-sm font-medium">
                        Score: {resume.score}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Users */}
        {activeTab === "users" && (
          <div>
            <h1 className="text-3xl font-bold mb-8 gradient-text">Manage Users</h1>
            
            <div className="mb-6 flex items-center">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button className="ml-4">Add User</Button>
            </div>
            
            <div className="bg-card cyber-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Resumes</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Last Active</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-muted/30">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                              <UserCog className="w-4 h-4 text-primary" />
                            </div>
                            <div className="font-medium">{user.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{user.resumes}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {new Date(user.lastActive).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">Edit</Button>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20">Delete</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
        {/* Resumes */}
        {activeTab === "resumes" && (
          <div>
            <h1 className="text-3xl font-bold mb-8 gradient-text">Resume Analytics</h1>
            
            <div className="mb-6 flex items-center">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search resumes..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="bg-card cyber-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Resume Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredResumes.map((resume) => (
                      <tr key={resume.id} className="hover:bg-muted/30">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center mr-3">
                              <FileText className="w-4 h-4 text-secondary" />
                            </div>
                            <div className="font-medium">{resume.title}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{resume.user}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {new Date(resume.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            resume.score >= 80 
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                              : resume.score >= 70 
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" 
                                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          }`}>
                            {resume.score}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">View</Button>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20">Delete</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
        {/* Settings */}
        {activeTab === "settings" && (
          <div>
            <h1 className="text-3xl font-bold mb-8 gradient-text">Admin Settings</h1>
            
            <div className="bg-card cyber-border rounded-xl overflow-hidden mb-8">
              <Tabs defaultValue="general" className="p-6">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                  <TabsTrigger value="api">API Keys</TabsTrigger>
                </TabsList>
                
                <TabsContent value="general" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Application Settings</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Site Name</Label>
                          <Input defaultValue="AI Resume Analyzer" />
                        </div>
                        <div className="space-y-2">
                          <Label>Contact Email</Label>
                          <Input defaultValue="admin@example.com" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Max Upload Size (MB)</Label>
                          <Input type="number" defaultValue={10} />
                        </div>
                        <div className="space-y-2">
                          <Label>Default Language</Label>
                          <select 
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Analytics</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-md">
                        <div>
                          <h4 className="font-medium">Enable Usage Analytics</h4>
                          <p className="text-sm text-muted-foreground">
                            Collect anonymous usage data to improve the application
                          </p>
                        </div>
                        <div className="flex items-center h-6">
                          <input 
                            type="checkbox" 
                            defaultChecked
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border rounded-md">
                        <div>
                          <h4 className="font-medium">Debug Mode</h4>
                          <p className="text-sm text-muted-foreground">
                            Enable additional logging for troubleshooting
                          </p>
                        </div>
                        <div className="flex items-center h-6">
                          <input 
                            type="checkbox" 
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button>Save Settings</Button>
                </TabsContent>
                
                <TabsContent value="security" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Security Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-md">
                        <div>
                          <h4 className="font-medium">Two-Factor Authentication</h4>
                          <p className="text-sm text-muted-foreground">
                            Require 2FA for all admin accounts
                          </p>
                        </div>
                        <div className="flex items-center h-6">
                          <input 
                            type="checkbox" 
                            defaultChecked
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border rounded-md">
                        <div>
                          <h4 className="font-medium">Session Timeout</h4>
                          <p className="text-sm text-muted-foreground">
                            Automatically log out inactive users
                          </p>
                        </div>
                        <div className="w-32">
                          <select 
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="30">30 minutes</option>
                            <option value="60">60 minutes</option>
                            <option value="120">2 hours</option>
                            <option value="0">Never</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Password Policy</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Minimum Password Length</Label>
                          <Input type="number" defaultValue={8} />
                        </div>
                        <div className="space-y-2">
                          <Label>Password Expiry (days)</Label>
                          <Input type="number" defaultValue={90} />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border rounded-md">
                        <div>
                          <h4 className="font-medium">Require Special Characters</h4>
                          <p className="text-sm text-muted-foreground">
                            Passwords must contain special characters
                          </p>
                        </div>
                        <div className="flex items-center h-6">
                          <input 
                            type="checkbox" 
                            defaultChecked
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button>Save Security Settings</Button>
                </TabsContent>
                
                <TabsContent value="api" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">API Keys</h3>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-md">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium">Production API Key</h4>
                          <Button variant="outline" size="sm">Regenerate</Button>
                        </div>
                        <div className="relative">
                          <Input 
                            type="text" 
                            value="sk_prod_2023abcdef1234567890abcdef123456" 
                            readOnly 
                          />
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                            onClick={() => {
                              navigator.clipboard.writeText("sk_prod_2023abcdef1234567890abcdef123456");
                              toast.success("API key copied to clipboard");
                            }}
                          >
                            Copy
                          </Button>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-md">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium">Development API Key</h4>
                          <Button variant="outline" size="sm">Regenerate</Button>
                        </div>
                        <div className="relative">
                          <Input 
                            type="text" 
                            value="sk_dev_2023abcdef1234567890abcdef123456" 
                            readOnly 
                          />
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                            onClick={() => {
                              navigator.clipboard.writeText("sk_dev_2023abcdef1234567890abcdef123456");
                              toast.success("API key copied to clipboard");
                            }}
                          >
                            Copy
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">API Rate Limiting</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Requests per Minute</Label>
                          <Input type="number" defaultValue={60} />
                        </div>
                        <div className="space-y-2">
                          <Label>Maximum Burst Size</Label>
                          <Input type="number" defaultValue={100} />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button>Save API Settings</Button>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

interface LabelProps {
  children: React.ReactNode;
}

const Label: React.FC<LabelProps> = ({ children }) => {
  return (
    <label className="block text-sm font-medium mb-1">{children}</label>
  );
};

export default AdminPanel;
