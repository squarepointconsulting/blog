import { getFirestore, collection } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from 'firebase/storage';
import { defineNuxtPlugin, useAppConfig } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  const db = getFirestore(nuxtApp.$firebaseApp);
  const storage = getStorage(nuxtApp.$firebaseApp);
  const usersRef = collection(db, "users");
  const analytics = getAnalytics(nuxtApp.$firebaseApp);


  return {
    provide: {
      db,
      usersRef,
      storage,
      analytics
    },
  };
});