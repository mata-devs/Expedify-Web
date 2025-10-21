import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase";
import { useExpedifyStore } from "../utils/useExpedifyStore";

interface Props {
  children: React.ReactNode;
}

const RedirectedRoute: React.FC<Props> = ({ children }) => {
  const currentUser = auth.currentUser;

  const {
    locationPermission,
    notifPermission,
  } = useExpedifyStore();
  const hasGrantedPermissions =
    locationPermission === "granted" && notifPermission === "granted";

  // If not logged in → redirect to /signin
  if (currentUser && hasGrantedPermissions) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default RedirectedRoute;
