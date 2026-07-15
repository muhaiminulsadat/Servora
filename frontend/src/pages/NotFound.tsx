import { Link, useRouteError } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileQuestion, Home } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

export default function NotFound() {
  const error = useRouteError() as any;
  console.error(error);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 text-center">
        <div className="max-w-md space-y-6 rounded-2xl border border-border bg-card p-8 shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <FileQuestion className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            404
          </h1>
          <p className="text-xl font-semibold text-foreground">
            Page Not Found
          </p>
          <p className="text-muted-foreground">
            {error?.statusText || error?.message || "Sorry, we couldn't find the page you are looking for."}
          </p>
          <div className="pt-4">
            <Link to="/">
              <Button className="w-full gap-2 bg-primary hover:bg-primary/95 text-white">
                <Home className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
