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

<template>
  <div v-if="home" class="space-y-4">
  <HomeSummary :homeId="homeId" />
  <HomeValue :homeId="homeId"/>
  <article class="p-4 bg-white shadow-md rounded-md">
      <NuxtLink to="/score">
        <h2 class="text-lg font-bold">Level Up
          <UIcon name="i-heroicons-chevron-double-right" class="w-4 h-4" />
        </h2>
        <p class="text-gray-700">Increase your home's VillaFact Score to increase your net asset value. Complete these
          simple
          activities to build your profile.</p>
      </NuxtLink>
    </article>
    <article class="p-4 bg-white shadow-md rounded-md">
      <NuxtLink to="/invest">
        <h2 class="text-lg font-bold">Invest
          <UIcon name="i-heroicons-chevron-double-right" class="w-4 h-4" />
        </h2>
        <p class="text-gray-700">Plan and track home improvement projects to maximize your costs basis.</p>
      </NuxtLink>
    </article>
    <article class="p-4 bg-white shadow-md rounded-md">
      <NuxtLink to="/advice">
        <h2 class="text-lg font-bold">Advice
          <UIcon name="i-heroicons-chevron-double-right" class="w-4 h-4" />
        </h2>
        <p class="text-gray-700">GenAI Powered advice for homeowners about the best way to increase the value and lower
          the costs of your home.</p>
      </NuxtLink>
    </article>
  </div>
  <div v-else class="space-y-4">
    <article class="p-4 bg-white shadow-md rounded-md">
      <p>Home not found ...</p>
    </article>
  </div>
</template>

