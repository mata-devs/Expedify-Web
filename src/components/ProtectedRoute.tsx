import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
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
    const location = useLocation();
    const hasGrantedPermissions =
        locationPermission !== "granted" && notifPermission !== "granted";
    // If not logged in → redirect to /signin
    if (!currentUser) {
        const fullUrl =
            location.pathname + location.search + location.hash;
        return <Navigate to="/signin" replace
            state={{ from: fullUrl }}
        />;
    }
    if (hasGrantedPermissions) {

        const fullUrl =
            location.pathname + location.search + location.hash;

        return <Navigate to="/permissions" replace
            state={{ from: fullUrl }}
        />;
    }
    return <>{children}</>;
};

export default ProtectedRoute;
