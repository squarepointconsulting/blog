<script setup>
import { useRoute } from 'vue-router';
import { doc } from 'firebase/firestore'
import { useProtectionSection } from '@/composables/useProtectionStatus'
const { checkSectionExists } = useProtectionSection()

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
  icon: 'i-mdi-fire-extinguisher',
  to: 'protection/fire-extinguishers',
  id: 'info.protection.fireExtinguishers'
}, {
  label: 'Home Devices',
  icon: 'i-heroicons-home',
  to: 'protection/home-devices',
  id: 'info.protection.homeDevices'
}, {
  label: 'Smoke And Carbon Monoxide Detectors',
  icon: 'i-mdi-fire-circle',
  to: 'protection/home-detectors',
  id: 'info.protection.homeDetectors'
},
{
  label: 'Home Security',
  icon: 'i-mdi-home-clock-outline',
  to: 'protection/home-security',
  id: 'info.protection.homeSecurity'
},{
  label: 'Fire Sprinklers',
  icon: 'i-mdi-fire-off',
  to: 'protection/home-fire-sprinklers',
  id: 'info.protection.fireSprinklers'
}
]

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
              <div  class="group-hover:text-primary relative" v-if="checkSectionExists(home, link.id)">
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
