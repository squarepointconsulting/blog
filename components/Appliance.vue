<template>
    <article class="p-4 bg-white shadow-md rounded-md">
      <NuxtLink :to="{ name: 'homes-homeId-score', params: { homeId: homeId } }">
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

  </template>

<script setup>

import { useRoute } from 'vue-router';
import { useCollection } from 'vuefire'
import { collection, query, orderBy, doc, where } from 'firebase/firestore'

const title = ref("Hello World")
const description = ref("An overview of how hello world has chnaged the world.")

const route = useRoute();
const homeId = route.params.homeId;
const { $db } = useNuxtApp();
const docRef = doc($db, 'properties', homeId);
const home = useDocument(docRef)
const tasksRef = collection($db, 'properties', homeId, 'project_records');
const tasksQuery = query(tasksRef, orderBy('timestamp', 'desc'));
// const tasks = await  useCollection(tasksQuery);

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

function snakeToNormalText(snakeStr) {
    return snakeStr
        .split('_')                // Split the string by underscores
        .map(word =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()  // Capitalize the first letter of each word
        )
        .join(' ');                // Join the words back with spaces
}

const columns = [
    {
        key: 'type',
        label: 'Type',
    },
    { label: 'Date', key: 'timestamp' },
    {
        key: 'completedByUserDisplayName',
        label: 'User',
    },
]


const featuredProjects = [
    {
        link: './projects/gutter-cleaning',
        image: '/images/gutter-maintenance-banner.jpg',
        alt: 'Gutter Maintenance',
        title: '🌟 Featured'
    },
    {
        link: './projects/property-avatar',
        image: '/images/property-avatar-example.jpg',
        alt: 'Property Avatar',
        title: 'Avatar Quest'
    },
    {
        link: './projects/roof-inspection',
        image: '/images/roof-inspection.jpg',
        alt: 'Roof Inspection',
        title: 'Roof Inspection'
    }
];

</script>

<style scoped>
.chart-container {
    height: 100px;
}
</style>

