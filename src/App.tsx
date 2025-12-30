import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import LoadingScreen from "./components/LoadingScreen";
import Onboarding from "./pages/Onboarding";
import CreateProfile from "./pages/CreateProfile";
import Permissions from "./pages/Permissions";
import { useExpedifyStore } from "./utils/useExpedifyStore";
import Dashboard from "./pages/Dashboard";
import type { UserData } from "./utils/type";
import { fetchBookingsRealtime } from "./services/fetchBookings";
import { subscribeNearbyRushBookings } from "./services/fetchNearbyBookingsRealtime";
import useRealtimeLocation from "./services/useRealtimeLocation";
import ProtectedRoute from "./components/ProtectedRoute";
import RedirectedRoute from "./components/RedirectedRoute";
import useUserCalls from "./hooks/useUserCalls";
import JoinAsCreatorPage from "./pages/join-as-creator/page";
import CreatorApplication from "./pages/application/page";
import ConfirmEmail from "./pages/confirm/email/page";
export const radius: number = 4000;
const App: React.FC = () => {
  const {
    user,
    setUser,
    onboardingDone,
    setHasProfile,
    hasProfile,
    loading,
    setLoading,
    locationPermission,
    notifPermission, setLocationPermission,
    setNotifPermission,
    setUserData, setBookings, setNearbyBookings,
    location, setLocation, setMyBookings, setRushBooking
  } = useExpedifyStore();
  const RealtimeLocation = useRealtimeLocation();
  // ✅ Get user's location
  useEffect(() => {
    if (RealtimeLocation)
      setLocation(RealtimeLocation);
  }, [RealtimeLocation]);
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const ref = doc(db, "users", currentUser.uid);
          const snap = await getDoc(ref);
          setHasProfile(snap.exists());
          if (snap.exists()) {
            setUserData({ ...snap.data(), id: snap.id } as UserData);
          }
        } catch (err) {
          console.error("Error fetching user profile:", err);
          setHasProfile(false);
        }
      } else {
        setHasProfile(null);
      }

      setLoading(false);
    });

    if (auth.currentUser) {

      return () => unsub();
    } else {
      setUser(null);
    }
  }, [setUser, setHasProfile, setLoading, auth]);

  useEffect(() => {
    if (!user?.uid) return;

    const unsub = fetchBookingsRealtime(
      user.uid,
      "photographer", // or "client"
      (data) => {
        console.log("data", data);
        const res = data.filter((b) => b.status === "active")[0];
        setBookings(data);
        setRushBooking(res);
        console.log("res", res);
      },
      (err) => console.error(err)
    );

    return () => unsub();
  }, [user?.uid]);
  useEffect(() => {
    if (!auth.currentUser) return;
    if (!location) { console.warn("Error Location", location); return; };
    const unsub = subscribeNearbyRushBookings(
      location.lat,
      location.lng,
      (data) => {

        setNearbyBookings(data);
      },
      radius

    );
    return () => unsub();
  }, [location]);

  const checkLocationPermission = async (): Promise<PermissionState> => {
    try {
      const result = await navigator.permissions.query({ name: "geolocation" });
      return result.state; // "granted" | "denied" | "prompt"
    } catch (err) {
      console.error("Location permission error:", err);
      return "denied";
    }
  };
  const checkNotificationPermission = (): NotificationPermission => {
    if (!("Notification" in window)) return "denied"; // Not supported 
    return Notification.permission; // "granted" | "denied" | "default"
  }; 

  useEffect(() => {
    // Check location permission
    (async () => {
      const locPerm = await checkLocationPermission();
      setLocationPermission(locPerm);
    })();

    // Check notification permission
    const notifPerm = checkNotificationPermission();
    setNotifPermission(notifPerm);
  }, []);
  if (loading) return <LoadingScreen />;


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Onboarding" element={
          <RedirectedRoute>
            <Onboarding />
          </RedirectedRoute>
        } />

        <Route path="/" element={<JoinAsCreatorPage />} />
        <Route path="/confirm/email" element={<ConfirmEmail />} />
        <Route path="/application" element={<ProtectedRoute><CreatorApplication /></ProtectedRoute>} />
        <Route path="/signin" element={
          <RedirectedRoute>
            <SignIn />
          </RedirectedRoute>
        } />
        <Route path="/signup" element={
          <RedirectedRoute>
            <SignUp />
          </RedirectedRoute>
        } />
        <Route path="/forgot" element={
          <RedirectedRoute>
            <ForgotPassword />
          </RedirectedRoute>
        } />

        <Route path="/permissions" element={
          <RedirectedRoute>
            <Permissions />
          </RedirectedRoute>
        } />


        <Route path="/create-profile" element={
          <ProtectedRoute>
            <CreateProfile />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
