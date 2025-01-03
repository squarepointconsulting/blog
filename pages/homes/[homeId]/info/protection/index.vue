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

const links = [{
  label: 'Fire Extinguishers',
  icon: 'i-heroicons-home',
  to: 'protection/fire-extinguishers',
  id: 'info.protection.fireExtinguishers'
}, {
  label: 'Home Devices',
  icon: 'i-heroicons-home',
  to: 'protection/home-devices',
  id: 'info.protection.homeDevices'
}, {
  label: 'Smoke And Carbon Monoxide Detectors',
  icon: 'i-mdi-home',
  to: 'protection/home-detectors',
  id: 'info.protection.homeDetectors'
},
{
  label: 'Home Security',
  icon: 'i-mdi-home',
  to: 'protection/home-security',
  id: 'info.protection.homeSecurity'
},{
  label: 'Fire Sprinklers',
  icon: 'i-mdi-home',
  to: 'protection/home-fire-sprinklers',
  id: 'info.protection.homeFireSprinklers'
}
]

const checkSectionExists = (path) => {
    const keys = path.split('.')
    let current = home.value
    
    for (const key of keys) {
        if (!current || typeof current !== 'object') {
            return false
        }
        current = current[key]
    }
    return current !== undefined && current !== null
}
</script>


<template>
  <div v-if="home" class="space-y-4">
      <article class="p-4 bg-white shadow-md rounded-md">

          <h2 class="text-lg font-bold flex items-center gap-3">
              <UButton icon="i-heroicons-arrow-left" variant="soft" color="gray" class="rounded-full h-8 w-8"
                  @click="() => router.back()" />
              Protection
          </h2>

      </article>
      <article class="p-4 bg-white shadow-md rounded-md space-y-4">
          <UVerticalNavigation :links="links">
            <template #default="{ link }">
              <span class="group-hover:text-primary relative">{{ link.label }}</span>
              <div v-if="checkSectionExists(link.id)">
                <p class="text-sm text-green-500">Completed</p>
              </div>
            </template>

        </UVerticalNavigation>
      </article>

  </div>
  <div v-else class="space-y-4">
      <article class="p-4 bg-white shadow-md rounded-md">
          <p>Home not found ...</p>
      </article>
  </div>
</template>
