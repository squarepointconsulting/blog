<script setup>
useHead({
  title: 'HomeFacts',
  link: [
    {
      rel: 'stylesheet',
      href: 'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'
    },
    {
      rel: 'stylesheet',
      href: 'https://cdnjs.cloudflare.com/ajax/libs/overlayscrollbars/1.9.1/css/OverlayScrollbars.min.css'
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css?family=Open+Sans'
    },
    {
      rel: 'stylesheet',
      href: 'https://unpkg.com/bulma@0.9.3/css/bulma.min.css'
    }
  ]
})

import { signOut } from 'firebase/auth';
const isMobileNavOpen = ref(false)
const auth = useFirebaseAuth()
const router = useRouter()
const user = useCurrentUser()

const gravatarData = await useFetch("https://www.gravatar.com/avatar/0b743d20b65b963cfbca71218d65e9b6a38acf7f469d4dd9203c8707395acaa9")
const avatarUrl = gravatarData.data.value


// const avatarUrl =  fetch("https://api.gravatar.com/v3/profiles/0b743d20b65b963cfbca71218d65e9b6a38acf7f469d4dd9203c8707395acaa9") //  "https://0.gravatar.com/avatar/131326d51e7c0019e584bd61951e81c4"
//                       .then(function (response) {
//                         response.json()
//                       })
//                       .then(function(data) {
//                         data
//                       })

function handleSignOut() {
  signOut(auth)
    .then(() => router.replace('login'))
}

</script>

<template>
  <div class="flex flex-col h-screen">
    <!-- Header -->
    <header class="flex justify-between items-center bg-gray-800 text-white p-4">
      <div class="flex items-center space-x-4">
        <!-- Left slot for icons -->
        <slot name="left-icons">
          <span v-if="user"><Gravatar /></span>
          <span v-if="user"> {{ user.displayName }}</span>
          <span></span>
          <span v-if="user"><UButton @click="handleSignOut">Log Out</UButton>
          </span>
        </slot>
      </div>
      <div class="flex items-center space-x-4">
        <!-- Right slot for icons -->
        <slot name="right-icons">
          <span><UIcon name="i-heroicons-bell" class="w-8 h-8" /></span>
          <span><UIcon name="i-heroicons-cog-8-tooth" class="w-8 h-8" /></span>
        </slot>
      </div>
    </header>
  
    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto p-4 bg-gray-100">
      <NuxtPage />
    </main>
  
    <!-- Footer -->
    <footer class="flex justify-between items-center bg-gray-800 text-white p-4">
      <div class="flex items-center space-x-4">
        <!-- Left slot for icons -->
        <slot name="footer-left-icons">
          <span>
            <NuxtLink to="/">
            <UIcon name="i-heroicons-home" class="w-8 h-8" /></NuxtLink></span>
        </slot>
      </div>
      <div class="flex items-center space-x-4">
        <!-- Center slot for icons -->
        <slot name="footer-center-icons">
          <span><NuxtLink to="/">
            <UIcon name="i-heroicons-calendar-days" class="w-8 h-8" /></NuxtLink></span>
        </slot>
      </div>
      <div class="flex items-center space-x-4">
        <!-- Right slot for icons -->
        <slot name="footer-right-icons">
          <span><NuxtLink to="/">
            <UIcon name="i-heroicons-clipboard-document-check" class="w-8 h-8" /></NuxtLink></span>
        </slot>
      </div>
    </footer>
  </div>
  </template>

<style>
html,
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
  font-size: 10px;
  background: #f0f2f4;
}

a {
  color: #3e8ed0;
  transition: color 0.3s ease;
}

a:hover {
  color: #2d628f;
}

.navbar.is-white {
  background: #f0f2f4;
}
.navbar-brand .brand-text {
  font-size: 1.11rem;
  font-weight: bold;
}
.articles {
  margin: 5rem 0;
  margin-top: -200px;
}
.articles .content p {
  line-height: 1.9;
  margin: 15px 0;
}
.author-image {
  position: absolute;
  top: -30px;
  left: 50%;
  width: 60px;
  height: 60px;
  margin-left: -30px;
  border: 3px solid #ccc;
  border-radius: 50%;
}
.media-center {
  display: block;
  margin-bottom: 1rem;
}
.article,
.promo-block {
  margin-top: 6rem;
}
div.column.is-8:first-child {
  padding-top: 0;
  margin-top: 0;
}
.article-title {
  font-size: 2rem;
  font-weight: lighter;
  line-height: 2;
}
.article-subtitle {
  color: #909aa0;
  margin-bottom: 3rem;
}
.article-body {
  line-height: 1.4;
  margin: 0 6rem;
}
.promo-block .container {
  margin: 1rem 5rem;
}
</style>
