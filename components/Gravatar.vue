<template>
    <div>
      <div v-if="gravatarUrl">
        <img :class="imageClass" :src="gravatarUrl" alt="Profile" />
      </div>
      <div v-else>
        <p>Loading avatar...</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import SHA256 from 'crypto-js/sha256'
  import { useFetch } from '#app'
  const user = useCurrentUser()

  const gravatarUrl = ref('')
  const imageClass = ref('') // Define your class name
  
  // Function to generate Gravatar URL
  const getGravatarUrl = (email) => {
    const hash = SHA256(email.trim().toLowerCase()).toString()
    return `https://www.gravatar.com/avatar/${hash}`
  }
  
  // Fetch the Gravatar image using useFetch
  const fetchGravatar = async () => {
    const user = await getCurrentUser()
    const url = getGravatarUrl(user.email)
    imageClass.value = `w-${props.size} h-${props.size} rounded-full object-fill bg-transparent hover:bg-transparent`
    gravatarUrl.value = user.photoURL;
  }
  
  onMounted(() => {
    fetchGravatar()
  })

  const props = defineProps(['size'])

  </script>