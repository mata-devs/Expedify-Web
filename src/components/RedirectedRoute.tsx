import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { auth } from "../firebase";
import { useExpedifyStore } from "../utils/useExpedifyStore";

interface Props {
  children: React.ReactNode;
}

const RedirectedRoute: React.FC<Props> = ({ children }) => {
  const currentUser = auth.currentUser;
  const { userData, user } = useExpedifyStore()
  const location = useLocation();
  const {
    locationPermission,
    notifPermission,
  } = useExpedifyStore();
  const hasGrantedPermissions =
    locationPermission === "granted" && notifPermission === "granted";

  // If not logged in → redirect to /signin
  if ((currentUser || (userData && user)) && hasGrantedPermissions) {
    const from = location.state?.from || "/dashboard";
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};

export default RedirectedRoute;
