<script setup>

import { useRoute } from 'vue-router';
import { doc } from 'firebase/firestore'
const route = useRoute();
const homeId = route.params.id;
const { $db } = useNuxtApp();
const docRef = doc($db, 'properties', homeId);
const home = useDocument(docRef)

const items = [{
  label: 'Exterior',
  key: 'exterior',
  icon: 'i-mdi-home',
  content: 'Roofs and stuff'
}, {
  label: 'Interior',
  key: 'interior',
  icon: 'i-mdi-sofa',
  content: 'Beds and Baths and stuff',
  disabled: true,
}, {
  label: 'Appliances',
  key: 'appliances',
  icon: 'i-mdi-fridge',
  content: 'Dishwashers and refrigerators and stuff',
  disabled: true,
},]

const sections = [{
  label: 'Roof',
  icon: 'i-mdi-home-outline',
  defaultOpen: false,
  slot: 'roof'
}, {
  label: 'Gutters',
  icon: 'i-heroicons-arrow-down-tray',
  defaultOpen: false,
  slot: 'gutters'
}, {
  label: 'Siding',
  icon: 'i-heroicons-eye-dropper',
  defaultOpen: false,
  slot: 'siding',
}, {
  label: 'Paint',
  icon: 'i-heroicons-rectangle-group',
  slot: 'paint',
},]



</script>

<template>
  <div v-if="home" class="space-y-4">
    <HomeSummary :homeId="homeId" />
    <article class="p-4 bg-white shadow-md rounded-md">
      <UTabs :items="items" class="w-full">
        <template #item="{ item }">
          <div v-if="item.key === 'exterior'" class="space-y-3">
            <UAccordion :items="sections" color="gray">
              <template #item="{ item }">
                <p class="italic text-gray-900 dark:text-white text-center">
                  {{ item.description }}
                </p>
              </template>

              <template #roof>
                <Roof />

              </template>

              <template #gutters>
                <Gutters />
              </template>

              <template #siding>
                <Siding />
              </template>

              <template #paint>
                <Paint /> 
              </template>

            </UAccordion>
          </div>
        </template>
      </UTabs>

    </article>
  </div>
  <div v-else class="space-y-4">
    <article class="p-4 bg-white shadow-md rounded-md">
      <p>Home not found ...</p>
    </article>
  </div>
</template>
