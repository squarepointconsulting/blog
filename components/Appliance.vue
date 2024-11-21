<template>
    <div class="example">
      <h1>{{ title }}</h1>
      <p>{{ description }}</p>
    </div>
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

