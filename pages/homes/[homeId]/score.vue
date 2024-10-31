<template>

    <div v-if="home" class="space-y-4">
        <div class="space-y-4">
            <div class="p-4 bg-white shadow-md rounded-md">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="space-y-3">
                        <h3 class="text-xl font-semibold">Your VillaFact Score <UIcon name="i-material-symbols-target"
                                class="w-5 h-5"></UIcon>
                        </h3>
                        <p class="text-gray-600">
                            The VillaFact score shows how you rank with your neighbors and nationally for completing and
                            logging routine home maintenance items.
                            Complete the projects, capture the proof, and use this to maximize the value of your home.
                        </p>

                        <div class="flex-1 flex flex-col justify-center items-center">
                        <!-- Row 1 -->
                        <div class="w-full flex justify-center items-center">
                            <div class="chart-container">
                                <GaugeChart />
                            </div>
                        </div>
                        <!-- Row 2 -->
                        <div class="w-full flex justify-center items-center">
                            <p class="font-bold text-center">{{ Math.round(home.villaFactScore) }}</p>
                        </div>
                    </div>

                    </div>


                    <!-- Right column with image placeholder -->
                    <div class="flex items-center justify-center">
                        <NuxtLink :to="`./projects/${featuredQuestId}`" class="relative block cursor-pointer group">
                            <img src="/images/gutter-maintenance-banner.jpg" alt="Score visualization"
                                class="rounded-lg shadow-sm transition-opacity group-hover:opacity-90" />
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

<UTabs :items="items" class="w-full">
  <template #item="{ item }">
    <div v-if="item.key === 'projects'" class="space-y-3">
      <UTable :rows="tasks" :columns="columns">
        <template #timestamp-data="{ row }">
          {{ row.timestamp.toDate().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          hour12: true,
          }) }}
        </template>
      </UTable>
    </div>
    <div v-if="item.key === 'quests'" class="space-y-3">
        <article class="p-4 bg-white shadow-md rounded-md">
                <h2 class="text-lg font-bold">Avatar Quest</h2>
                <p class="text-gray-700 mb-3">Upload a photo of your home's exterior to begin your home maintenance
                    journey. This helps us personalize your experience and track improvements over time.</p>
                <div class="text-sm text-blue-600">✓ Completed on March 15, 2024</div>
                <div class="text-sm text-green-600">+25 pts</div>

            </article>
            <article class="p-4 bg-white shadow-md rounded-md">
                <h2 class="text-lg font-bold">Sink or Swim Quest</h2>
                <p class="text-gray-700 mb-3">Protect your home from water damage by completing these essential
                    maintenance tasks:</p>
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
</UTabs>

</article>


        </div>




    </div>
    <div v-else class="space-y-4">
        <article class="p-4 bg-white shadow-md rounded-md">
            <p>Home not found ...</p>
        </article>
    </div>




</template>

<script setup>

import { useRoute } from 'vue-router';
import { useCollection } from 'vuefire'
import { collection, query, orderBy, doc, where } from 'firebase/firestore'

const route = useRoute();
const homeId = route.params.homeId;
const { $db } = useNuxtApp();
const docRef = doc($db, 'properties', homeId);
const home = useDocument(docRef)
const tasksRef = collection($db, 'properties', homeId, 'project_records');
const tasksQuery = query(tasksRef, orderBy('timestamp', 'desc'));
const tasks = useCollection(tasksQuery);

const featuredQuestId = ref('gutter-cleaning') // You can set this from your data


const items = [{
  label: 'Projects',
  key: 'projects',
  icon: 'i-pajamas-issue-type-feature',
  content: 'This is the content shown for Tab1'
}, {
  label: 'Quests',
  key: 'quests',
  icon: 'i-pajamas-issue-type-objective',
  content: 'Check back soon for more quests!'
}]

const columns = [
  { label: 'Date', key: 'timestamp' },
  {
    key: 'type',
    label: 'Type',
  }, {
    key: 'completedByUserDisplayName',
    label: 'User',
  },
]





</script>

<style scoped>
.chart-container {
    height: 100px;
}
</style>