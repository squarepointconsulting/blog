import { getFirestore, collection } from "firebase/firestore";

export default defineNuxtPlugin((nuxtApp) => {
  const db = getFirestore(nuxtApp.$firebaseApp);
  const usersRef = collection(db, "users");

  return {
    provide: {
      db,
      usersRef,
    },
  };
});