import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Clock, Users } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showAdminCode, setShowAdminCode] = useState(false);
  const [adminCode, setAdminCode] = useState("");

  const handleAdminAccess = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (adminCode === "1234") {
      navigate('/admin');
    } else {
      toast({
        variant: "destructive",
        title: "Invalid code",
        description: "Please enter the correct admin code.",
      });
      setAdminCode("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8f9fe] to-[#eef1ff]">
      <div className="w-full max-w-4xl p-8">
        <div className="text-center mb-12 space-y-3">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#e7722d] to-orange-500 bg-clip-text text-transparent flex items-center justify-center gap-2 relative">
            <Clock className="h-8 w-8 text-[#e7722d]" strokeWidth={2.5} />
            ClockWise
            <span className="absolute -bottom-2 left-[calc(50%+70px)] -translate-x-1/2 text-xs">
              <span className="text-gray-400">By Tap&Save</span>
            </span>
          </h1>
          <p className="text-xl text-black mt-6">Track your work hours efficiently</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="group hover:shadow-xl transition-all duration-300 bg-white/70 backdrop-blur-lg border border-white/20">
            <CardHeader className="text-center pb-4">
              <CardTitle className="flex items-center justify-center gap-3 text-2xl">
                <Clock className="h-8 w-8 text-[#e7722d] group-hover:scale-110 transition-transform" />
                Employee Portal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-500 text-sm text-center">
                  Clock in and out with your employee code
                </p>
                <Button 
                  className="w-full bg-gradient-to-r from-[#e7722d] to-orange-500 hover:from-[#e7722d]/90 hover:to-orange-500/90 transition-all duration-300"
                  onClick={() => navigate('/employee')}
                >
                  Access Time Clock
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 bg-white/70 backdrop-blur-lg border border-white/20">
            <CardHeader className="text-center pb-4">
              <CardTitle className="flex items-center justify-center gap-3 text-2xl">
                <Users className="h-8 w-8 text-[#e7722d] group-hover:scale-110 transition-transform" />
                Admin Portal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-500 text-sm text-center">
                  Monitor employee attendance and manage records
                </p>
                {showAdminCode ? (
                  <form onSubmit={handleAdminAccess} className="space-y-2">
                    <Input
                      type="password"
                      placeholder="Enter admin code"
                      value={adminCode}
                      onChange={(e) => setAdminCode(e.target.value)}
                      className="text-center"
                      maxLength={4}
                    />
                    <Button 
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#e7722d] to-orange-500 hover:from-[#e7722d]/90 hover:to-orange-500/90 transition-all duration-300"
                    >
                      Submit
                    </Button>
                  </form>
                ) : (
                  <Button 
                    className="w-full bg-gradient-to-r from-[#e7722d] to-orange-500 hover:from-[#e7722d]/90 hover:to-orange-500/90 transition-all duration-300"
                    onClick={() => setShowAdminCode(true)}
                  >
                    Access Dashboard
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;