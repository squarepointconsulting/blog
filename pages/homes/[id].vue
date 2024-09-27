<script setup>

import { useRoute } from 'vue-router';
import { useAsyncData } from 'nuxt/app';
import { doc, getDoc } from 'firebase/firestore';

import { useCollection } from 'vuefire'
import { collection, query, where } from 'firebase/firestore'

const route = useRoute();
const homeId = route.params.id;
const { $db } = useNuxtApp();
const docRef = doc($db, 'properties', homeId);
const home = useDocument(docRef)

const items = [{
label: 'Tab1',
icon: 'i-heroicons-information-circle',
content: 'This is the content shown for Tab1'
}, {
label: 'Tab2',
icon: 'i-heroicons-arrow-down-tray',
disabled: true,
content: 'And, this is the content for Tab2'
}, {
label: 'Tab3',
icon: 'i-heroicons-eye-dropper',
content: 'Finally, this is the content for Tab3'
}]

</script>

<template>
  <div v-if="home" class="space-y-4">
  <HomeSummary :homeId="homeId" />
  <HomeValue :homeId="homeId"/>
  <article class="p-4 bg-white shadow-md rounded-md">
    <UTabs :items="items" />
    </article>
  </div>
  <div v-else class="space-y-4">
    <article class="p-4 bg-white shadow-md rounded-md">
      <p>Home not found ...</p>
    </article>
  </div>
</template>

