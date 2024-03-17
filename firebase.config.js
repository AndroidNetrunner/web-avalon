import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG);

const app = initializeApp(firebaseConfig);
if (typeof window !== "undefined") getAnalytics(app);

export const database = getDatabase(app, firebaseConfig.databaseURL);
