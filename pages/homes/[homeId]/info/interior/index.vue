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
  label: 'Caulk and Grout',
  icon: 'i-mdi-bathtub-outline',
  to: 'interior/caulk-and-grout',
  id: 'info.interior.caulkAndGrout'
}, {
  label: 'Flooring',
  icon: 'i-mdi-floor-plan',
  to: 'interior/flooring',
  id: 'info.interior.flooring'
}, {
  label: 'Garage',
  icon: 'i-mdi-car-outline',
  to: 'interior/garage',
  id: 'info.interior.garage'
},
{
  label: 'Interior Walls',
  icon: 'i-mdi-wall',
  to: 'interior/interior-walls',
  id: 'info.interior.interiorWalls'
},{
  label: 'Main Structure Doors',
  icon: 'i-mdi-door',
  to: 'interior/main-structure-doors',
  id: 'info.interior.mainStructureDoors'
},{
  label: 'Windows',
  icon: 'i-mdi-window-closed',
  to: 'interior/windows',
  id: 'info.interior.windows'
},{
  label: 'Fireplace',
  icon: 'i-mdi-fireplace',
  to: 'interior/fireplace',
  id: 'info.interior.fireplace'
}
]

</script>


<template>
  <div v-if="home" class="space-y-4">
      <article class="p-4 bg-white shadow-md rounded-md">

          <h2 class="text-lg font-bold flex items-center gap-3">
              <UButton icon="i-heroicons-arrow-left" variant="soft" color="gray" class="rounded-full h-8 w-8"
                  @click="() => router.back()" />
              Interior
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
