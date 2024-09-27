<script setup>
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics, logEvent } from "firebase/analytics";
import { collection, doc, setDoc, addDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore";
import { onMounted, ref } from 'vue'

const auth = useFirebaseAuth()
const router = useRouter()
const { $analytics } = useNuxtApp();
const { $db } = useNuxtApp();

const user = useCurrentUser()

const newUser = ref({
  docVersion: 1.1,
  displayName: '',
  providerId: '',
  photoURL: '',
  email: '',
  emailVerified: false,
  lastLogin: null,
})

const newHome = ref({
  docVersion: 1.0,
  address: {
    city: "Your City",
    state: "OR",
    street1: "1919 NE Main St",
    street2: "",
    zip: "90210",
  },
  currentAppraisedValue: 1000000,
  geoip: '',
  villaFactScore: 500,
  imageUrl: false,
  ownerId: '',
  updated_at: null,
})

async function addUser(uid) {
  const newDocUser = await setDoc(doc($db, "users", uid), {
    ...newUser.value
  })
}

async function addHouse() {
  const newDocHome = await addDoc(doc($db, "properties"), {
    ...newHome.value
  })
}


async function getOrCreateDefaultHome(uid) {
  const q = query(collection($db, "properties"), where("ownerId", "==", uid));

  getDocs(q).then((querySnapshot) => {
    //console.log(querySnapshot)
    if (querySnapshot.empty) {
      newHome.value.ownerId = uid
      addHouse().then((docRef) => {
        console.log(docRef);
        return docRef.id;
      })
    }
    else {
      querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      return doc.id
    });
    }
  })
}

const home = ref({
  id: '',
  address: null,
})

function signInWithGoogle() {
  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({ prompt: 'select_account' });
  signInWithPopup(auth, provider)
    .then((userCredential) => {
      // Signed in
      logEvent($analytics, `user_logged_in`);

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
      
      home.value.id = getOrCreateDefaultHome(user.uid)
    })
    .then((homeId) => {
      console.log("Home value", homeId)
      router.replace('/profile')
    })
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