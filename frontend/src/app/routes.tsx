import {createBrowserRouter} from "react-router-dom";
import {lazy, Suspense} from "react";
import Navbar from "@/components/layout/Navbar";
import Signup from "@/features/auth/pages/Signup";
import Login from "@/features/auth/pages/Login";

const Home = lazy(() => import("@/pages/Home"));

export const routes = createBrowserRouter([
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
  },
]);
