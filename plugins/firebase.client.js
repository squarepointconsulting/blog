import { getFirestore, collection } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

export default defineNuxtPlugin((nuxtApp) => {
  const db = getFirestore(nuxtApp.$firebaseApp);
  const storage = getStorage(nuxtApp.$firebaseApp);
  const usersRef = collection(db, "users");

  return {
    provide: {
      db,
      usersRef,
      storage
    },
  };
});