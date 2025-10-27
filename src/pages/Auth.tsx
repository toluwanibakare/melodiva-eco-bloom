import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { nigeriaStates, securityQuestions } from "@/data/nigeriaLocations";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: "",
    fullName: "",
    securityQuestion: "",
    securityAnswer: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  // Sign up form data
  const [signUpData, setSignUpData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    whatsappNumber: "",
    address: "",
    state: "",
    city: "",
    securityQuestion: "",
    securityAnswer: "",
    password: "",
    confirmPassword: ""
  });

  // Sign in form data
  const [signInData, setSignInData] = useState({
    email: "",
    password: ""
  });

  // Check if user is already logged in
  useEffect(() => {
    let active = true;

    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (active && session && window.location.pathname !== "/auth") {
        navigate("/");
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        navigate("/");
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [navigate]);


  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signUpData.password !== signUpData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    if (signUpData.password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: signUpData.email,
        password: signUpData.password,
        options: {
          data: {
            full_name: signUpData.fullName,
            phone_number: signUpData.phoneNumber,
            whatsapp_number: signUpData.whatsappNumber || signUpData.phoneNumber,
            address: signUpData.address,
            state: signUpData.state,
            city: signUpData.city,
            security_question: signUpData.securityQuestion,
            security_answer: signUpData.securityAnswer.toLowerCase()
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        toast({
          title: "Sign Up Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success!",
          description: "Account created successfully. You're now logged in.",
        });
        navigate("/");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: signInData.email,
        password: signInData.password
      });

      if (error) {
        toast({
          title: "Sign In Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Welcome Back!",
          description: "You've been signed in successfully.",
        });
        navigate("/");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getCitiesForState = () => {
    const stateData = nigeriaStates.find(s => s.state === selectedState);
    return stateData?.cities || [];
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (forgotPasswordData.newPassword !== forgotPasswordData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    if (forgotPasswordData.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Get user profile to verify security answer
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('security_question, security_answer, user_id')
        .eq('email', forgotPasswordData.email)
        .eq('full_name', forgotPasswordData.fullName)
        .eq('security_question', forgotPasswordData.securityQuestion);

      if (profileError || !profiles || profiles.length === 0) {
        toast({
          title: "Error",
          description: "Could not find account with provided information",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      const profile = profiles[0];
      
      // Verify security answer (case-insensitive)
      if (profile.security_answer.toLowerCase() !== forgotPasswordData.securityAnswer.toLowerCase()) {
        toast({
          title: "Error",
          description: "Security answer is incorrect",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // Send password reset email
      const { error } = await supabase.auth.resetPasswordForEmail(forgotPasswordData.email, {
        redirectTo: `${window.location.origin}/auth?reset=true`
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success!",
          description: "Password reset link has been sent to your email",
        });
        setForgotPasswordOpen(false);
        setForgotPasswordData({
          email: "",
          fullName: "",
          securityQuestion: "",
          securityAnswer: "",
          newPassword: "",
          confirmPassword: ""
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <Card className="w-full max-w-2xl p-8 animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Welcome to Melodiva</h1>
          <p className="text-muted-foreground mt-2">Natural beauty, naturally yours</p>
        </div>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <Label htmlFor="signin-email">Email Address</Label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="your@email.com"
                  value={signInData.email}
                  onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="signin-password">Password</Label>
                <Input
                  id="signin-password"
                  type="password"
                  placeholder="••••••••"
                  value={signInData.password}
                  onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing In..." : "Sign In"}
              </Button>
              
              <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
                <DialogTrigger asChild>
                  <Button variant="link" className="w-full mt-2">
                    Forgot Password?
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Reset Password</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div>
                      <Label htmlFor="forgot-email">Email Address</Label>
                      <Input
                        id="forgot-email"
                        type="email"
                        value={forgotPasswordData.email}
                        onChange={(e) => setForgotPasswordData({ ...forgotPasswordData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="forgot-fullname">Full Name</Label>
                      <Input
                        id="forgot-fullname"
                        type="text"
                        value={forgotPasswordData.fullName}
                        onChange={(e) => setForgotPasswordData({ ...forgotPasswordData, fullName: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="forgot-security-question">Security Question</Label>
                      <Select
                        value={forgotPasswordData.securityQuestion}
                        onValueChange={(value) => setForgotPasswordData({ ...forgotPasswordData, securityQuestion: value })}
                        required
                      >
                        <SelectTrigger id="forgot-security-question">
                          <SelectValue placeholder="Select your security question" />
                        </SelectTrigger>
                        <SelectContent>
                          {securityQuestions.map((question) => (
                            <SelectItem key={question} value={question}>
                              {question}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="forgot-security-answer">Security Answer</Label>
                      <Input
                        id="forgot-security-answer"
                        type="text"
                        value={forgotPasswordData.securityAnswer}
                        onChange={(e) => setForgotPasswordData({ ...forgotPasswordData, securityAnswer: e.target.value })}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Verifying..." : "Reset Password"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={signUpData.fullName}
                    onChange={(e) => setSignUpData({ ...signUpData, fullName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={signUpData.email}
                    onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="+234 XXX XXX XXXX"
                    value={signUpData.phoneNumber}
                    onChange={(e) => setSignUpData({ ...signUpData, phoneNumber: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="whatsappNumber">WhatsApp (Optional)</Label>
                  <Input
                    id="whatsappNumber"
                    type="tel"
                    placeholder="+234 XXX XXX XXXX"
                    value={signUpData.whatsappNumber}
                    onChange={(e) => setSignUpData({ ...signUpData, whatsappNumber: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  placeholder="Your full address"
                  value={signUpData.address}
                  onChange={(e) => setSignUpData({ ...signUpData, address: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Select
                    value={signUpData.state}
                    onValueChange={(value) => {
                      setSignUpData({ ...signUpData, state: value, city: "" });
                      setSelectedState(value);
                    }}
                    required
                  >
                    <SelectTrigger id="state">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {nigeriaStates.map((state) => (
                        <SelectItem key={state.state} value={state.state}>
                          {state.state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Select
                    value={signUpData.city}
                    onValueChange={(value) => setSignUpData({ ...signUpData, city: value })}
                    disabled={!signUpData.state}
                    required
                  >
                    <SelectTrigger id="city">
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {getCitiesForState().map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="securityQuestion">Security Question *</Label>
                <Select
                  value={signUpData.securityQuestion}
                  onValueChange={(value) => setSignUpData({ ...signUpData, securityQuestion: value })}
                  required
                >
                  <SelectTrigger id="securityQuestion">
                    <SelectValue placeholder="Select a security question" />
                  </SelectTrigger>
                  <SelectContent>
                    {securityQuestions.map((question) => (
                      <SelectItem key={question} value={question}>
                        {question}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="securityAnswer">Security Answer *</Label>
                <Input
                  id="securityAnswer"
                  type="text"
                  placeholder="Your answer"
                  value={signUpData.securityAnswer}
                  onChange={(e) => setSignUpData({ ...signUpData, securityAnswer: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={signUpData.password}
                    onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={signUpData.confirmPassword}
                    onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
