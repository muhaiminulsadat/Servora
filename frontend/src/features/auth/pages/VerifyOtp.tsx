import * as React from "react";
import {useState, useEffect} from "react";
import {useLocation, useNavigate, Link} from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {InputOTP, InputOTPGroup, InputOTPSlot} from "@/components/ui/input-otp";
import {ShieldCheck, ArrowLeft, RefreshCw} from "lucide-react";
import toast from "react-hot-toast";
import {signUpVerifyApiCall} from "../services/verify";
import {signUpMailSendApiCall} from "../services/signup";
import {useDispatch} from "react-redux";
import {setToken} from "../authSlice";

export default function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [isResending, setIsResending] = useState(false);

  // Extract registration info from navigation state
  const state = location.state || {};
  const {email, name, role, password} = state;

  // Redirect to signup if state info is missing
  useEffect(() => {
    if (!email || !name || !role || !password) {
      toast.error("Invalid session. Please register first.");
      navigate("/signup", {replace: true});
    }
  }, [email, name, role, password, navigate]);

  // Cooldown timer for OTP resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (otp.length !== 4) {
      toast.error("Please enter the 4-digit code");
      return;
    }

    setIsLoading(true);
    try {
      const res = await signUpVerifyApiCall({
        name,
        email,
        password,
        confirmPassword: password, // Already validated on signup page
        role,
        otp,
      });

      console.log(res);

      dispatch(setToken(res.data.accessToken));

      toast.success(res.message || "Email verified successfully!");
      // Navigate to login or dashboard
      navigate("/", {replace: true});
    } catch (error: any) {
      toast.error(error.message || "Invalid OTP code.");
    } finally {
      setIsLoading(false);
    }
  };

  // Automatically submit once all 4 digits are typed
  useEffect(() => {
    if (otp.length === 4) {
      handleVerify();
    }
  }, [otp]);

  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return;

    setIsResending(true);
    try {
      const res = await signUpMailSendApiCall({
        name,
        email,
        password,
        confirmPassword: password,
        role,
      });
      toast.success(res.message || "A new code has been sent!");
      setResendCooldown(60);
    } catch (error: any) {
      toast.error(error.message || "Failed to resend code.");
    } finally {
      setIsResending(false);
    }
  };

  if (!email) return null;

  return (
    <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-radial from-background via-background/95 to-muted/20 overflow-hidden">
      {/* Background decorations matching Signup */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-72 h-72 rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

      <Card className="w-full max-w-md relative backdrop-blur-md bg-card/85 border border-border/60 shadow-xl transition-all duration-300 hover:shadow-2xl">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Verify Email
          </CardTitle>
          <CardDescription className="text-muted-foreground/90 max-w-xs mx-auto">
            We sent a 4-digit code to{" "}
            <span className="font-semibold text-foreground">{email}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-center justify-center pb-6">
          <form
            onSubmit={handleVerify}
            className="w-full flex flex-col items-center space-y-6"
          >
            <div className="flex justify-center py-2">
              <InputOTP
                maxLength={4}
                value={otp}
                onChange={setOtp}
                disabled={isLoading}
                autoFocus
              >
                <InputOTPGroup className="gap-2">
                  <InputOTPSlot
                    index={0}
                    className="w-14 h-14 text-xl font-semibold border rounded-lg focus-visible:ring-2 focus-visible:ring-primary transition-all duration-150"
                  />
                  <InputOTPSlot
                    index={1}
                    className="w-14 h-14 text-xl font-semibold border rounded-lg focus-visible:ring-2 focus-visible:ring-primary transition-all duration-150"
                  />
                  <InputOTPSlot
                    index={2}
                    className="w-14 h-14 text-xl font-semibold border rounded-lg focus-visible:ring-2 focus-visible:ring-primary transition-all duration-150"
                  />
                  <InputOTPSlot
                    index={3}
                    className="w-14 h-14 text-xl font-semibold border rounded-lg focus-visible:ring-2 focus-visible:ring-primary transition-all duration-150"
                  />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button
              type="submit"
              disabled={isLoading || otp.length !== 4}
              className="w-full h-11 rounded-lg font-medium transition-transform duration-150 active:scale-[0.97]"
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 border-t border-border/40 py-4">
          <div className="flex justify-between items-center w-full text-sm">
            <Link
              to="/signup"
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors duration-150 group"
            >
              <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
              <span>Back to Signup</span>
            </Link>

            <button
              onClick={handleResend}
              disabled={resendCooldown > 0 || isResending}
              className="inline-flex items-center gap-1.5 text-primary hover:underline hover:text-primary/90 disabled:text-muted-foreground disabled:no-underline font-medium transition-colors duration-150"
            >
              {isResending ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Resending...</span>
                </>
              ) : resendCooldown > 0 ? (
                <span>Resend in {resendCooldown}s</span>
              ) : (
                <span>Resend Code</span>
              )}
            </button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
