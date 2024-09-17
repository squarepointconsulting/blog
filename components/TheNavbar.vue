<script setup>

import { signOut } from 'firebase/auth';

const isMobileNavOpen = ref(false)
const auth = useFirebaseAuth()
const router = useRouter()
const user = useCurrentUser()

function handleSignOut() {
  signOut(auth)
    .then(() => router.replace('login'))
}


</script>

<template>
  <nav class="navbar">
    <div class="container">
      <div class="navbar-brand">
        <nuxt-link to="/" class="navbar-item has-text-weight-bold is-size-5">
          VillaFacts
        </nuxt-link>
      </div>
      <div v-if="user">
        {{ user.displayName }}
      </div>
      <div class="content-end">
        <UButton @click="handleSignOut">Log Out</UButton>
      </div>
    </div>
  </nav>
</template>

<style></style>
