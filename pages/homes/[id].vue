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
const tasksRef = collection($db, 'properties', homeId, 'project_records');
const tasks = useCollection(tasksRef);
const isEditing = ref(false);


const items = [{
  label: 'Projects',
  key: 'projects',
  icon: 'i-pajamas-issue-type-feature',
  content: 'This is the content shown for Tab1'
},  {
  label: 'Quests',
  key: 'quests',
  icon: 'i-pajamas-issue-type-objective',
  content: 'Check back soon for more quests!'
}]

const columns = [
{ label: 'Date', key: 'timestamp'},
{
  key: 'type',
  label: 'Type',
}, {
  key: 'completedByUserDisplayName',
  label: 'User',
},
]

</script>

<template>
  <div v-if="home" class="space-y-4">
    <HomeSummary :homeId="homeId" />
    <HomeValue :homeId="homeId" />
    <article class="p-4 bg-white shadow-md rounded-md">

      <UTabs :items="items" class="w-full">
        <template #item="{ item }">
          <div v-if="item.key === 'projects'" class="space-y-3">
            <UButton icon="i-heroicons-plus" @click="isEditing = true" label="Add Project" color="green" />
            <UTable v-if="!isEditing"  :rows="tasks" :columns="columns">
              <template #timestamp-data="{ row }">
                {{ row.timestamp.toDate().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'numeric', 
    day: 'numeric' 
}) }}
                </template>
            </UTable>
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
