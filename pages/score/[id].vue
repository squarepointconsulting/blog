<template>
    <!-- Blog posts list -->
    <div class="space-y-4">
        <div class="p-4 bg-white shadow-md rounded-md">
            <!-- Added grid layout with two columns -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Left column with placeholder text -->
                <div class="space-y-3">
                    <h3 class="text-xl font-semibold">Your VillaFact Score <UIcon name="i-material-symbols-target" class="w-5 h-5"  ></UIcon></h3>
                    <p class="text-gray-600">
                        The VillaFact score shows how you rank with your neighbors and nationally for completing and logging routine home maintenance items. 
                        Complete the projects, capture the proof, and use this to maximize the value of your home.
                    </p>
                    <p class="text-gray-600">
                        Current Score: 75/100
                    </p>
                </div>
                <!-- Right column with image placeholder -->
                <div class="flex items-center justify-center">
                    <NuxtLink 
                        :to="`/quests/${featuredQuestId}`"
                        class="relative block cursor-pointer group"
                    >
                        <img 
                            src="https://placehold.co/200x300?text=Quest+1+Avatar" 
                            alt="Score visualization" 
                            class="rounded-lg shadow-sm transition-opacity group-hover:opacity-90"
                        />
                        <!-- Overlay -->
                        <div class="absolute inset-0 flex items-center justify-center">
                            <div class="bg-black bg-opacity-50 text-white px-4 py-2 rounded-md">
                                <span class="font-semibold">Featured Quest</span>
                            </div>
                        </div>
                    </NuxtLink>
                </div>
            </div>
        </div>
        <article class="p-4 bg-white shadow-md rounded-md">
            <h2 class="text-lg font-bold">Avatar Quest</h2>
            <p class="text-gray-700 mb-3">Upload a photo of your home's exterior to begin your home maintenance journey. This helps us personalize your experience and track improvements over time.</p>
            <div class="text-sm text-blue-600">✓ Completed on March 15, 2024</div>
        </article>
        <article class="p-4 bg-white shadow-md rounded-md">
            <h2 class="text-lg font-bold">Sink or Swim Quest</h2>
            <p class="text-gray-700 mb-3">Protect your home from water damage by completing these essential maintenance tasks:</p>
            <ul class="list-disc ml-6 mb-4 text-gray-700">
                <li>Check for leaks under sinks</li>
                <li>Inspect water heater connections</li>
                <li>Test sump pump functionality</li>
            </ul>
            <Progress color="success" aria-label="Loading..." value={33} />
            <p class="text-sm text-gray-500 mt-2">1 of 3 tasks completed</p>
        </article>
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue"
import { getDocs } from 'firebase/firestore'

const { $usersRef } = useNuxtApp();
const querySnapshot = await getDocs($usersRef)
const featuredQuestId = ref('featured-quest') // You can set this from your data

onMounted(() => {
    querySnapshot.forEach((doc) => {
        console.log(doc.id)
    })
})
</script>