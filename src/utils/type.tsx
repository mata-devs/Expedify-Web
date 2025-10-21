import type { GeoPoint, Timestamp } from "firebase/firestore";
import level1 from "../assets/levels/level1.png";
import level2 from "../assets/levels/level2.png";
import level3 from "../assets/levels/level3.png";
export type Place = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  address?: string;
};
export type PhotographerLevel = "entry" | "medium" | "pro";
export type Gender = "Male" | "Female" | "Prefer not to say" | "Undefined" | "";
export type UserType = "Client" | "Photographer" | "Manager" | "";
export type UserData = {
  uid: string;
  fullname: string;
  email: string;
  phoneNumber: string;
  gender: Gender;
  bday: Date;
  socketID?: string;
  fcmToken?: string;
  userType: UserType;
  portfolio?: Photographer | null;
  ratings?: number;
  clients?: number;
  coordinates: GeoPoint;
  photoURL?: string;
  distanceKm?: number;
  bgphoto?: string;
  rushBookID: string | null;
};

export type Photographer = {
  level: PhotographerLevel[];
  images: {
    isHiglighted: boolean;
    url: string
  }[];
  reviews: ReviewsType[];
  priceMin: number;
  priceMax: number;
};
export type ReviewsType = {
  id: string;
  bookingId: string;
  clientId: string;
  rating: number;
  photographerId: string;
  user?: UserData | null;
  comment: string;
}

export type LevelType = {
  name: string;
  Image: any;
  level: PhotographerLevel;
};


export interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}

export interface FirestoreGeoPoint {
  latitude: number;
  longitude: number;
}

export interface GeoHashData {
  geohash: string;
  geopoint: GeoPoint;
}
export interface ChatType{
  id?:string;
  clientID:string;
  photographerID:string;
  messages:MessageType[];
  Photographer?:UserData;
  Client?:UserData;
}
export interface MessageType{
  id?:string;
  createdAt:Timestamp;
  senderId:string;
  text:string;
}
export type BookingType = "Schedule" | "Rush";
export type BookingStatus = "pending" | "accepted" | "active" | "declined" | "cancel" | "complete";
export type Booking = {
  id?: string;
  clientId?: string;
  photographerId: string | null;
  dateCreate: Timestamp; // Firestore Timestamp
  dateSchedule?: Timestamp; // Firestore Timestamp
  dateCompleted?: Timestamp;
  dateCancelled?: Timestamp;
  status: BookingStatus;
  notes?: string;
  Photographer?: UserData;
  Client?: UserData;
  price?: number;
  type?: BookingType;
  level?: LevelType;
  rate?: number;
  distanceKm: number;
  location?: GeoPoint;
  images?: ImagesPhotos
  geohash?: string;
};

export const Levels = [
  {
    name: "Smartshot",
    Image: level1,
    level: "entry"
  },
  {
    name: "Mid Photographers",
    Image: level2,
    level: "medium"
  },
  {
    name: "Pro Photographers",
    Image: level3,
    level: "pro"
  }
] as LevelType[];
export type CallType = {
  id?: string;
  createdAt: string;
  ownerID: string;
  targetID: string;
  method: "Audio" | "Video";
  owner?: UserData;
  status: "calling" | "ongoing" | "ended";
  offer: {
    sdp: string;
    type: string;
  }
  target?: UserData;
}
export type ImagesPhotos = {
  photographerID: string,
  clientID: string,
  photos: string[],
  bookingID: string
}
export type FavoratePhotographer = {
  id: string;
  userID: string;
  photographerID: string,
  Photographer?: UserData | null;
}
export const LIGHT_PRESETS = {
  day: {
    position: [1.5, 210, 30],
    color: "#ffffff",
    intensity: 0.5,
  },
  dusk: {
    position: [1.5, 200, 90],
    color: "#ffe0b2",
    intensity: 0.4,
  },
  night: {
    position: [1.0, 180, 180],
    color: "#a0c8f0",
    intensity: 0.2,
  },
};