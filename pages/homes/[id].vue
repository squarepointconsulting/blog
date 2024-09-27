<template>
    <div v-if="home">
      <h1>{{ home.address.street1 }}</h1>
      <p>{{ home.villaFactScore }}</p>
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

const route = useRoute();
const homeId = route.params.id;
const { $db } = useNuxtApp();
const docRef = doc($db, 'properties', homeId);
const home = useDocument(docRef)

  </script>