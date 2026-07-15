import {createBrowserRouter} from "react-router-dom";
import {lazy, Suspense} from "react";
import Navbar from "@/components/layout/Navbar";
import Signup from "@/features/auth/pages/Signup";
import Login from "@/features/auth/pages/Login";
import NotFound from "@/pages/NotFound";
import VerifyOtp from "@/features/auth/pages/VerifyOtp";

const Home = lazy(() => import("@/pages/Home"));

export const routes = createBrowserRouter([
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/",
    element: (
      <>
        <Navbar />
        <Suspense fallback={<div>Loading...</div>}>
          <Home />
        </Suspense>
      </>
    ),
    errorElement: <NotFound />,
  },
  {
    path: "/signup",
    element: (
      <>
        <Navbar />
        <Suspense fallback={<div>Loading...</div>}>
          <Signup />
        </Suspense>
      </>
    ),
    errorElement: <NotFound />,
  },
  {
    path: "/login",
    element: (
      <>
        <Navbar />
        <Suspense fallback={<div>Loading...</div>}>
          <Login />
        </Suspense>
      </>
    ),
    errorElement: <NotFound />,
  },

  {
    path: "/verify-otp",
    element: (
      <>
        <Navbar />
        <Suspense fallback={<div>Loading...</div>}>
          <VerifyOtp />
        </Suspense>
      </>
    ),
    errorElement: <NotFound />,
  },
]);
