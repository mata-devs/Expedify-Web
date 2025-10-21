import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "firebase/auth";
import type { Booking, UserData } from "./type";

interface ExpedifyState {
  // Firebase user
  user: User | null;
  setUser: (user: User | null) => void;

  userData: UserData | null;
  setUserData: (user: UserData | null) => void

  bookings: Booking[] | null;
  setBookings: (user: Booking[] | null) => void

  RushBooking: Booking | null;
  setRushBooking: (user: Booking | null) => void

  mybookings: Booking[] | null;
  setMyBookings: (user: Booking[] | null) => void

  nearbyBookings: Booking[] | null;
  setNearbyBookings: (user: Booking[] | null) => void
  // Onboarding
  onboardingDone: boolean;
  setOnboardingDone: (done: boolean) => void;


  location: { lat: number; lng: number } | null;
  setLocation: (location: { lat: number; lng: number } | null) => void
  // Permissions
  locationPermission: "granted" | "denied" | "prompt" | null;
  notifPermission: "granted" | "denied" | "default" | null;
  setLocationPermission: (value: "granted" | "denied" | "prompt" | null) => void;
  setNotifPermission: (value: "granted" | "denied" | "default" | null) => void;

  // Firestore profile
  hasProfile: boolean | null;
  setHasProfile: (exists: boolean | null) => void;

  // Loading state
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

// ✅ Global persistent store
export const useExpedifyStore = create<ExpedifyState>()(
  persist(
    (set) => ({
      user: null,
      userData: null,
      bookings: null,
      nearbyBookings: null,
      location: null,
      onboardingDone: false,
      locationPermission: null,
      notifPermission: null,
      hasProfile: null,
      loading: true,
      RushBooking:null,
      mybookings:null,
      setRushBooking:(RushBooking)=>set({RushBooking}),
      setMyBookings:(mybookings)=>set({mybookings}),
      setUser: (user) => set({ user }),
      setLocation: (location) => set({ location }),
      setNearbyBookings: (nearbyBookings) => set({ nearbyBookings }),
      setBookings: (bookings) => set({ bookings }),
      setUserData: (userData) => set({ userData }),
      setOnboardingDone: (done) => set({ onboardingDone: done }),
      setLocationPermission: (value) => set({ locationPermission: value }),
      setNotifPermission: (value) => set({ notifPermission: value }),
      setHasProfile: (exists) => set({ hasProfile: exists }),
      setLoading: (loading) => set({ loading }),
    }),
    {
      name: "expedify-store", // 💾 key in localStorage
      partialize: (state) => ({
        onboardingDone: state.onboardingDone,
        locationPermission: state.locationPermission,
        notifPermission: state.notifPermission,
      }), // only persist these keys
    }
  )
);
