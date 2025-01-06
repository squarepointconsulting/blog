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
  label: 'Heating System',
  icon: 'i-heroicons-home',
  to: 'hvac/heating',
  id: 'info.hvac.heating'
}, {
  label: 'Cooling System',
  icon: 'i-heroicons-home',
  to: 'hvac/cooling',
  id: 'info.hvac.cooling'
}, {
  label: 'Air Ducts',
  icon: 'i-mdi-home',
  to: 'hvac/air-ducts',
  id: 'info.hvac.airDucts'
}, {
  label: 'Air Filter',
  icon: 'i-mdi-home',
  to: 'hvac/air-filter',
  id: 'info.hvac.airFilter'
},
]

</script>

<template>
    <div v-if="home" class="space-y-4">
        <article class="p-4 bg-white shadow-md rounded-md">

            <h2 class="text-lg font-bold flex items-center gap-3">
                <UButton icon="i-heroicons-arrow-left" variant="soft" color="gray" class="rounded-full h-8 w-8"
                    @click="() => router.back()" />
                Plumbing
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
