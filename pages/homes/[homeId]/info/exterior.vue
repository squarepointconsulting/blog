<script setup>
import { useRoute } from 'vue-router';
import { doc } from 'firebase/firestore'

const route = useRoute();
const homeIdRef = useState('homeId')
const homeId = route.params.homeId;
homeIdRef.value = homeId;

const { $db } = useNuxtApp();
const docRef = doc($db, 'properties', homeId);
const home = useDocument(docRef)

const router = useRouter();


const sections = [{
  label: 'Roof',
  icon: 'i-mdi-home-outline',
  defaultOpen: false,
  slot: 'roof'
}, {
  label: 'Gutters',
  icon: 'i-heroicons-arrow-down-tray',
  defaultOpen: false,
  slot: 'gutters'
}, {
  label: 'Siding',
  icon: 'i-heroicons-eye-dropper',
  defaultOpen: false,
  slot: 'siding',
}, {
  label: 'Paint',
  icon: 'i-heroicons-rectangle-group',
  slot: 'paint',
},]

</script>

<template>
    <div v-if="home" class="space-y-4">
        <article class="p-4 bg-white shadow-md rounded-md">

            <h2 class="text-lg font-bold flex items-center gap-3">
  <UButton
    icon="i-heroicons-arrow-left"
    variant="soft"
    color="gray"
    class="rounded-full h-8 w-8"
    @click="() => router.back()"
  />
  Exterior
</h2>
        </article>
        <article class="p-4 bg-white shadow-md rounded-md">
            <div class="space-y-3">
            <UAccordion :items="sections" color="gray">
              <template #item="{ item }">
                <p class="italic text-gray-900 dark:text-white text-center">
                  {{ item.description }}
                </p>
              </template>

              <template #roof>
                <HomeRoof />

              </template>

              <template #gutters>
                <HomeGutters />
              </template>

              <template #siding>
                <HomeSiding />
              </template>

              <template #paint>
                <HomePaint /> 
              </template>

            </UAccordion>
          </div>

        </article>
    </div>
    <div v-else class="space-y-4">
        <article class="p-4 bg-white shadow-md rounded-md">
            <p>Home not found ...</p>
        </article>
    </div>
</template>
