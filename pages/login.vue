<script setup>
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, sendSignInLinkToEmail, createUserWithEmailAndPassword, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { getAnalytics, logEvent } from "firebase/analytics";
import { collection, doc, setDoc, addDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore";
import { onMounted, ref } from 'vue'

const auth = useFirebaseAuth()

if (isSignInWithEmailLink(auth, window.location.href)) {
  console.log("Sign in with email link")
  // Additional state parameters can also be passed via URL.
  // This can be used to continue the user's intended action before triggering
  // the sign-in operation.
  // Get the email if available. This should be available if the user completes
  // the flow on the same device where they started it.
  let email = window.localStorage.getItem('emailForSignIn');
  console.log("Email: ", email)
  if (!email) {
    // User opened the link on a different device. To prevent session fixation
    // attacks, ask the user to provide the associated email again. For example:
    email = window.prompt('Please provide your email for confirmation');
  }
  // The client SDK will parse the code from the link for you.
  signInWithEmailLink(auth, email, window.location.href)
    .then((result) => {
      console.log("Sign in with email link result: ", result)
      // Clear email from storage.
      window.localStorage.removeItem('emailForSignIn');
      // You can access the new user by importing getAdditionalUserInfo
      // and calling it with result:
      // getAdditionalUserInfo(result)
      // You can access the user's profile via:
      // getAdditionalUserInfo(result)?.profile
      // You can check if the user is new or existing:
      // getAdditionalUserInfo(result)?.isNewUser
    })
    .catch((error) => {
      console.log("Sign in with email link error: ", error)
      // Some error occurred, you can inspect the code: error.code
      // Common errors could be invalid email and invalid or expired OTPs.
    });
}





const router = useRouter()
const { $analytics } = useNuxtApp();
const { $db } = useNuxtApp();

const user = useCurrentUser()

const showEmailLogin = ref(false)
const error = ref(null)
const email = ref('')
const isValidEmail = ref(false)
const password = ref('');

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

const signup = async () => {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    router.push('/');
  } catch (err) {
    error.value = err.message;
  }
};

const actionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be in the authorized domains list in the Firebase Console.
  url: 'http://localhost:3000/login',
  // This must be true.
  handleCodeInApp: true,
  // iOS: {
  //   bundleId: 'com.example.ios'
  // },
  // android: {
  //   packageName: 'com.example.android',
  //   installApp: true,
  //   minimumVersion: '12'
  // },
  //dynamicLinkDomain: 'localhost'
};

//const auth = getAuth();
const signInWithEmail = async () => {
  if (!isValidEmail.value) {
    return
  }
  console.log("Sending sign in link to email: ", email.value)
  await sendSignInLinkToEmail(auth, email.value, actionCodeSettings)
  .then(() => {
    // The link was successfully sent. Inform the user.
    // Save the email locally so you don't need to ask the user for it again
    // if they open the link on the same device.
    window.localStorage.setItem('emailForSignIn', email.value);
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log("Error sending sign in link: ", errorCode, errorMessage)
    // ...
  });
}

const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  isValidEmail.value = emailRegex.test(email.value)
}

</script>

<template>
  <div class="container space-y-4">
    <UCard>
      <template #header>
        Please log in to continue
      </template>
      <div class="space-y-4">
        <UButton @click="signInWithGoogle">Sign in with Google</UButton>
        <hr />
        <h3>Sign in with email</h3>
      <UInput
        v-model="email"
        label="Email"
        type="email"
        placeholder="Enter your email"
        :rules="[
          { required: true, message: 'Email is required' },
          { email: true, message: 'Please enter a valid email' }
        ]"
        @blur="validateEmail"
      />
      <UButton 
        @click="signInWithEmail"
        :disabled="!isValidEmail"
      >
        Send Sign In Link
      </UButton>
        <p v-if="error" class="text-red-500">{{ error }}</p>
      </div>
    </UCard>
  </div>
</template>