<script setup>
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'; 

const auth = useFirebaseAuth()
const router = useRouter()

function signInWithGoogle() {
const provider = new GoogleAuthProvider()
provider.setCustomParameters({ prompt: 'select_account' });
signInWithPopup(auth, provider)
.then((userCredential) => {
    // Signed in
    const user = userCredential.user;
    console.log(user)
    // TODO: Update User in firebase
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
      <template #footer>
        <UButton>Logout</UButton>
      </template>
    </UCard>
  </div>
</template>