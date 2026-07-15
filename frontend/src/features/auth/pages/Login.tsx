import * as React from "react";
import {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
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
import {Mail, Lock, Eye, EyeOff, ChevronRight, LogIn} from "lucide-react";
import toast from "react-hot-toast";
import {loginApiCall} from "../services/login";
import {setAuth} from "../authSlice";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Premium entry animation on mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    setIsLoading(true);

    try {
      const res = await loginApiCall({
        email,
        password,
      });

      // Dispatch to authSlice storing token and user details
      dispatch(
        setAuth({
          token: res.data.accessToken,
          user: res.data.user,
        })
      );

      toast.success(res.message || "Logged in successfully!");
      
      // Navigate to homepage
      navigate("/", {replace: true});
    } catch (error: any) {
      toast.error(error.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-radial from-background via-background/95 to-muted/20 overflow-hidden">
      {/* Decorative blurred backgrounds */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-72 h-72 rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

      <Card
        className={`w-full max-w-md relative backdrop-blur-md bg-card/85 border border-border/60 shadow-xl transition-all duration-500 ease-out hover:shadow-2xl ${
          isMounted
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-4 scale-[0.96]"
        }`}
      >
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-muted-foreground/90">
            Sign in to your Servora account to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  className="pl-10 h-10 rounded-lg focus-visible:ring-1 transition-all duration-200"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-primary hover:underline hover:text-primary/95 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground/60">
                  <Lock className="h-4 w-4" />
                </span>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-10 rounded-lg focus-visible:ring-1 transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-muted-foreground/60 hover:text-foreground transition-colors active:scale-95 duration-100"
                >
                  {showPassword ? (
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
              className="w-full h-10 rounded-lg mt-4 font-medium transition-all duration-150 active:scale-[0.97]"
            >
              {isLoading ? "Signing in..." : "Sign In"}
              {!isLoading && <LogIn className="ml-2 h-4 w-4" />}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-border/40 py-4">
          <p className="text-xs text-muted-foreground">
            Don't have an account yet?{" "}
            <Link
              to="/signup"
              className="font-semibold text-primary hover:underline hover:text-primary/90"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
