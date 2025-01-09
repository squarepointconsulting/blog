<script setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { doc } from 'firebase/firestore'
const route = useRoute();
const router = useRouter();
const homeId = route.params.homeId;
const { $db } = useNuxtApp();
const docRef = doc($db, 'properties', homeId);
const home = useDocument(docRef)


const links = [{
  label: 'Dashboard',
  icon: 'i-heroicons-chart-bar',
  to: '/homes/' + homeId
}, {
  label: 'Profile',
  icon: 'i-heroicons-home',
  to: { name: 'homes-homeId-edit', params: { homeId: homeId } }
}, ]

const sectionLinks = [{
  label: 'Home Information',
  icon: 'i-mdi-lightbulb-question-outline',
  to: './info/home-info'
}, {
  label: 'Protection',
  icon: 'i-mdi-shield-account-variant-outline',
  to: './info/protection'
}, {
  label: 'Exterior',
  icon: 'i-mdi-home-outline',
  to: './info/exterior'
},
{
  label: 'Interior',
  icon: 'i-mdi-sofa-outline',
  to: './info/interior'
}, {
  label: 'Appliances',
  icon:  'i-mdi-fridge-outline',
  to: './appliances'
},
{
  label: 'Plumbing',
  icon: 'i-mdi-pipe-disconnected',
  to: './info/plumbing'
},
{
  label: 'HVAC',
  icon: 'i-mdi-hvac',
  to: './info/hvac'
},

]

</script>

<template>
  <div v-if="home" class="space-y-4">
    <UHorizontalNavigation :links="links" class="border-b border-gray-200 dark:border-gray-800" />
    <article class="p-4 bg-white shadow-md rounded-md space-y-4">
      <UVerticalNavigation :links="sectionLinks" />
    </article>    
  </div>
  <div v-else class="space-y-4">
    <article class="p-4 bg-white shadow-md rounded-md">
      <p>Home not found ...</p>
    </article>
  </div>
</template>
