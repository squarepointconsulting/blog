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

const columns = [
  { label: 'Date', key: 'timestamp' },
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
    <article v-if="home" class="p-4 bg-white shadow-md rounded-md">
      <div class="flex w-full">
        <!-- Inner Div 1 -->
        <div class="flex-1 flex flex-col justify-center items-center">
          <div class="w-full flex justify-center items-center">

            <img class="w-24 h-24 rounded-full object-fill" style="text-align: center;" :src="home.imageUrl"
              alt="{{ home.address.street1 }}" />

          </div>
          <!-- Row 2 -->
          <div class="w-full flex justify-center items-center p-1">
            <p class="">{{ home.address.street1 }}</p>
          </div>
          <div>
            <input type="file" accept="image/*" @change="handleFileUpload" hidden ref="fileInput" />
          </div>
        </div>
        <!-- Inner Div 2 -->
        <div class="flex-1 flex flex-col justify-center items-center">
          <!-- Row 1 -->
          <div class="w-full flex justify-center items-center">
            <div class="chart-container">
              <GaugeChart />
            </div>
          </div>
          <!-- Row 2 -->
          <div class="w-full flex justify-center items-center">
d            <p class="font-bold text-center">{{ home.villaFactScore ? home.villaFactScore :
              home.villafactScore }}</p>
          </div>
        </div>
        <!-- Edit Button -->
        <div class="relative top-2 right-2">
          <NuxtLink :to="{ name: 'homes-edit-id', params: { id: homeId } }">
            <p><UIcon name="i-heroicons-pencil-square" />&nbsp;Edit</p>
          </NuxtLink>
        </div>

      </div>
    </article>

    <HomeValue :homeId="homeId" />
    <article class="p-4 bg-white shadow-md rounded-md">

      <UTabs :items="items" class="w-full">
        <template #item="{ item }">
          <div v-if="item.key === 'projects'" class="space-y-3">
            <UTable :rows="tasks" :columns="columns">
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

<style scoped>
.chart-container {
  height: 100px;
}
</style>