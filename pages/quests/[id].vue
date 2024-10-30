<script setup>

import { useRoute } from 'vue-router';
import { doc } from 'firebase/firestore'
const route = useRoute();
const homeId = route.params.id;
const { $db } = useNuxtApp();
const docRef = doc($db, 'properties', homeId);
const home = useDocument(docRef)

</script>

<template>
  <div v-if="home" class="space-y-4">
    <HomeSummary :homeId="homeId" />
    <article class="p-4 bg-white shadow-md rounded-md">
        <p>Lorem </p>
    </article>
  </div>
  <div v-else class="space-y-4">
    <article class="p-4 bg-white shadow-md rounded-md">
      <p>Home not found ...</p>
    </article>
  </div>
</template>

