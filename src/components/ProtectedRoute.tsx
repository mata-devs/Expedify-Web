import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase";
import { useExpedifyStore } from "../utils/useExpedifyStore";
import LoadingScreen from "./LoadingScreen";

interface Props {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
    const currentUser = auth.currentUser;
    const {
        locationPermission,
        notifPermission,
    } = useExpedifyStore();
    const hasGrantedPermissions =
        locationPermission !== "granted" && notifPermission !== "granted";
    // If not logged in → redirect to /signin
    if (!currentUser) {
        return <Navigate to="/signin" replace />;
    }
    if (hasGrantedPermissions) {

        return <Navigate to="/permissions" replace />;
    }
    return <>{children}</>;
};

export default ProtectedRoute;
