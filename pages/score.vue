<template>
    <!-- Blog posts list -->
    <div class="space-y-4">
        <article class="p-4 bg-white shadow-md rounded-md">
            <h2 class="text-lg font-bold">Welcome to the Score <UIcon name="i-material-symbols-target" class="w-5 h-5"  ></UIcon></h2>
            <p class="text-gray-700">The VillaFact score of you home shows how you rank with your neighbors and nationally for completing 
                and logging routine home maintenance items. Complete the projects, capture the proof, and use this to maximize the value of your home. 
             </p>
        </article>
        <article class="p-4 bg-white shadow-md rounded-md">
            <h2 class="text-lg font-bold">Task #1</h2>
            <p class="text-gray-700">Home Photo</p>
        </article>
        <!-- Add more blog posts as needed -->
    </div>
</template>

<script setup>
import { onMounted } from "vue"
import { getDocs } from 'firebase/firestore'

const { $usersRef } = useNuxtApp();
const querySnapshot = await getDocs($usersRef)

onMounted(() => {
    querySnapshot.forEach((doc) => {
        console.log(doc.id)
    })
    
})
</script>