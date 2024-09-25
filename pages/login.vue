<script setup>
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics, logEvent } from "firebase/analytics";
import { collection, doc, setDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore";
import { onMounted, ref } from 'vue'

const auth = useFirebaseAuth()
const router = useRouter()
const { $analytics } = useNuxtApp();
const { $db } = useNuxtApp();
const home = ref()

const user = useCurrentUser()
const q = query(collection($db, "properties"), where("ownerId", "==", `${user.uid}`));

const querySnapshot = await getDocs(q);

const newUser = ref({
  docVersion: 1.1,
  displayName: '',
  providerId: '',
  photoURL: '',
  email: '',
  emailVerified: false,
  lastLogin: null,
})

// Add a new document with a generated id.
async function addUser(uid) {
  const newDoc = await setDoc(doc($db, "users", uid), {
    ...newUser.value
  })
  // console.log(`Document written with ID: ${ newDoc.id }`);
};

function signInWithGoogle() {
  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({ prompt: 'select_account' });
  signInWithPopup(auth, provider)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      const updated_at_timestamp = serverTimestamp()
      // const ts = Timestamp.fromDate(Date.now())
      // console.log(Date.now().toString(), "User logged in: ", user.uid, user.displayName)
      console.log(user)
      newUser.value.displayName = user.displayName
      newUser.value.providerId = user.providerId
      newUser.value.photoURL = user.photoURL
      newUser.value.email = user.email
      newUser.value.emailVerified = user.emailVerified
      newUser.value.lastLogin = updated_at_timestamp // Timestamp.fromDate() // ate.now();
      // Update user in firestore
      addUser(user.uid)

      logEvent($analytics, `user_logged_in`);
      querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
  })
      // logEvent($analytics, `user_logged_in: ${user.uid}`);
      // if this user doesn't have a house yet, create one for them

    //   $db.collection("properties").where("ownerId", "==", `${user.uid}`)
    // .get()
    // .then((querySnapshot) => {
    //     querySnapshot.forEach((doc) => {f
    //         // doc.data() is never undefined for query doc snapshots
    //         console.log(doc.id, " => ", doc.data());
    //     });
    // })
    // .catch((error) => {
    //     console.log("Error getting documents: ", error);
    // });
    
    })
    .then(() => router.replace('/'))
}
</script>

<template>
  <div class="container">
    <UCard>
      <template #header>
        Log in to continue
      </template>
      <UButton @click="signInWithGoogle">
        Login with Google
      </UButton>
    </UCard>
  </div>
</template>