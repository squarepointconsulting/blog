<script setup>
useHead({
  title: 'VillaFact',
  link: [
    {
      rel: 'stylesheet',
      href: 'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css?family=Open+Sans'
    },
    {
      rel: 'stylesheet',
      href: 'https://unpkg.com/bulma@0.9.3/css/bulma.min.css'
    },
    { rel: 'manifest', href: '/manifest.json' },
  ]
})

const user = useCurrentUser()

function handleSignOut() {
  signOut(auth)
    .then(() => router.replace('login'))
}

const isOpen = ref(false)

import { useRouter } from 'vue-router';

const router = useRouter();

function navigateToPage() {
  router.push('/settings');
}

</script>

<template>
  <div class="flex flex-col h-screen">
    <!-- Header -->
    <header class="flex justify-between items-center bg-gray-800 text-white p-4">
      <div class="flex items-center space-x-4">
        <!-- Left slot for icons -->
        <slot name="left-icons">
          <span v-if="user"> <NuxtLink to="/profile"><Gravatar /></NuxtLink></span>
          <span><p>VillaFact</p></span>
        </slot>
      </div>
      <div class="flex items-center space-x-4">
        <!-- Right slot for icons -->
        <slot name="right-icons">
          <span><UButton icon="i-heroicons-bell" label="" @click="isOpen = true" class="bg-transparent hover:bg-sky-700" /></span>
          <span><UButton icon="i-heroicons-cog-8-tooth" label="" @click="navigateToPage" class="bg-transparent hover:bg-sky-700" /></span>
        </slot>
      </div>
      <USlideover v-model="isOpen">
      <div class="p-4 flex-1">
        <UButton
          color="gray"
          variant="ghost"
          size="sm"
          icon="i-heroicons-x-mark-20-solid"
          class="flex sm:hidden absolute end-5 top-5 z-10"
          square
          padded
          @click="isOpen = false"
        />
        <p class="h-full">You don't have any notifications.</p>
      </div>
    </USlideover>
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
