import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function AuthLayout() {
  const { isLoggedIn,  user } = useAuth();
  const location = useLocation();
  console.log(user?.user)

  if (!isLoggedIn) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }


  return <Outlet />;
}

export default AuthLayout;
