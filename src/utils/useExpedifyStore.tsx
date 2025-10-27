import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "firebase/auth";
import type { Booking, UserData } from "./type";
import type { StatusBooking } from "../components/MyBookings";
import type { CombinedChat } from "../components/chats/ChatSidebar";
export type TabsType = "current" | "bookings" | "chat" | "menu" | "Requests";
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
  showCall: boolean;
  setShowCall: (val: boolean) => void;
  nearbyBookings: Booking[] | null;
  setNearbyBookings: (user: Booking[] | null) => void
  // Onboarding
  onboardingDone: boolean;
  setOnboardingDone: (done: boolean) => void;

  selectedClient: CombinedChat | null;
  setSelectedClient: (val: CombinedChat | null) => void;

  activeTab: StatusBooking;
  setActiveTab: (val: StatusBooking) => void;
  currentTab: TabsType;
  setCurrentTabs: (val: TabsType) => void;
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
      activeTab: "Scheduled",
      nearbyBookings: null,
      location: null,
      onboardingDone: false,
      locationPermission: null,
      notifPermission: null,
      showCall:false,
      hasProfile: null,
      loading: true,
      RushBooking: null,
      currentTab: "current",
      mybookings: null,
      selectedClient: null,
      setSelectedClient: (selectedClient) => set({ selectedClient }),
      setShowCall: (showCall) => set({ showCall }),
      setCurrentTabs: (currentTab) => set({ currentTab }),
      setRushBooking: (RushBooking) => set({ RushBooking }),
      setActiveTab: (activeTab) => set({ activeTab }),
      setMyBookings: (mybookings) => set({ mybookings }),
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
