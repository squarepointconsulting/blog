<script setup>
import { useRoute } from 'vue-router';
import { useCollection } from 'vuefire'
import { collection, query, orderBy, doc, where } from 'firebase/firestore'

const route = useRoute();
const homeId = route.params.homeId;
const { $db } = useNuxtApp();
const docRef = doc($db, 'properties', homeId);
const home = useDocument(docRef)
const appliancesRef = collection($db, 'properties', homeId, 'appliances');
const appliancesQuery = query(appliancesRef, orderBy('category', 'asc'));
const appliances = useCollection(appliancesQuery);

const columns = [
    {
        key: 'category',
        label: 'Category',
    },
    {
        key: 'manufacturer',
        label: 'Manufacturer',
    },
]


</script>

<template>
  <div v-if="appliances && appliances.length" class="space-y-4">
    <article 
      class="p-4 bg-white shadow-md rounded-md" 
      v-for="appliance in appliances" 
      :key="appliance.id"
    >
      <h2 class="text-lg font-semibold">{{ appliance.name }}</h2> <!-- Display appliance name -->
      <p><strong>Manufacturer:</strong> {{ appliance.manufacturer }}</p> <!-- Display manufacturer -->
      <p><strong>Category:</strong> {{ appliance.category }}</p> <!-- Display category -->
      <p><strong>Description:</strong> {{ appliance.description }}</p> <!-- Display description -->
      <NuxtLink :to="`./appliances/${appliance.id}`" class="text-blue-600 hover:text-blue-800 hover:underline">
        View Details
      </NuxtLink> <!-- Link to appliance details -->
    </article>
  </div>
</template>