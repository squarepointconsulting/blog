<template>
    <div>
      <div v-if="gravatarUrl">
        <img class="w-10 h-10 rounded-full object-fill bg-white" :src="gravatarUrl" alt="Avatar" />
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

  //const email = ref('christopher.k.eckert@squarepointconsulting.com')
  const email = ref('christopher.k.eckert@squarepointconsulting.com')
  const gravatarUrl = ref('')
  
  // Function to generate Gravatar URL
  const getGravatarUrl = (email) => {
    const hash = SHA256(email.trim().toLowerCase()).toString()
    return `https://www.gravatar.com/avatar/${hash}`
  }
  
  // Fetch the Gravatar image using useFetch
  const fetchGravatar = async () => {
    const user = await getCurrentUser()
    const url = getGravatarUrl(user.email)
  
    const { data, error } = await useFetch(url, {
      method: 'GET',
      headers: {
        Accept: 'image/png', // Optional: Define the type of image
      },
    })
  
    if (!error.value) {
      gravatarUrl.value = url // Directly use the URL, no need for data
    } else {
      console.error('Error fetching Gravatar:', error.value)
    }
  }
  
  onMounted(() => {
    fetchGravatar()
  })
  </script>