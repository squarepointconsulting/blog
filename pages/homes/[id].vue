<template>
    <div v-if="home">
      <h1>{{ home.address.street1 }}</h1>
      <p>{{ home.villaFactScore }}</p>
      <UTabs :items="items" />
    </div>
    <div v-else>
        <p>Home not found ...</p>
      </div>
  </template>
  
  <script setup>
  import { useRoute } from 'vue-router';
  import { useAsyncData } from 'nuxt/app';
  import { doc, getDoc } from 'firebase/firestore';
  
import { useCollection } from 'vuefire'
import { collection, query, where } from 'firebase/firestore'

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

const route = useRoute();
const homeId = route.params.id;
const { $db } = useNuxtApp();
const docRef = doc($db, 'properties', homeId);
const home = useDocument(docRef)

  </script>