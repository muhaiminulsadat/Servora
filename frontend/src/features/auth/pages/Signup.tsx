import * as React from "react";
import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {
  User,
  Briefcase,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import {signUpMailSendApiCall} from "../services/signup";

type Role = "user" | "worker";

export default function Signup() {
  const [role, setRole] = useState<Role>("user");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const res = await signUpMailSendApiCall({
        name,
        email,
        password,
        confirmPassword,
        role,
      });

      console.log(res);

      toast.success(res.message);
      navigate("/verify-otp", {
        state: {
          email,
          name,
          role,
          password,
        },
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to register. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-radial from-background via-background/95 to-muted/20 overflow-hidden">
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-72 h-72 rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

      <Card className="w-full max-w-md relative backdrop-blur-md bg-card/85 border border-border/60 shadow-xl transition-all duration-300 hover:shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Create an Account
          </CardTitle>
          <CardDescription className="text-muted-foreground/90">
            Enter your details to get started with Servora
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-semibold tracking-wider uppercase text-muted-foreground/80">
              I want to join as a
            </Label>
            <div className="relative flex w-full p-1 bg-muted/60 border border-border/40 rounded-xl h-11">
              <div
                className="absolute top-1 bottom-1 rounded-lg bg-background shadow-xs transition-all duration-300 ease-out"
                style={{
                  width: "calc(50% - 4px)",
                  transform: `translateX(${role === "user" ? "0" : "100%"})`,
                }}
              />
              <button
                type="button"
                onClick={() => setRole("user")}
                className={`relative flex-1 flex items-center justify-center gap-2 text-sm font-medium transition-colors duration-200 z-10 ${
                  role === "user"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground/80"
                }`}
              >
                <User className="h-4 w-4" />
                <span>User</span>
              </button>
              <button
                type="button"
                onClick={() => setRole("worker")}
                className={`relative flex-1 flex items-center justify-center gap-2 text-sm font-medium transition-colors duration-200 z-10 ${
                  role === "worker"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground/80"
                }`}
              >
                <Briefcase className="h-4 w-4" />
                <span>Worker</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground/60">
                  <User className="h-4 w-4" />
                </span>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 h-10 rounded-lg"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground/60">
                  <Mail className="h-4 w-4" />
                </span>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-10 rounded-lg"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground/60">
                  <Lock className="h-4 w-4" />
                </span>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-10 rounded-lg"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-muted-foreground/60 hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground/60">
                  <Lock className="h-4 w-4" />
                </span>
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10 h-10 rounded-lg"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-muted-foreground/60 hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 rounded-lg mt-2 font-medium"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
              {!isLoading && <ChevronRight className="ml-1 h-4 w-4" />}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-border/40 py-4">
          <p className="text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-primary hover:underline hover:text-primary/90"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
