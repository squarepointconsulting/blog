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

// Get initial tab from URL query or default to 0
const activeTab = ref(route.query.tab || 0);

// Update URL when tab changes
const handleTabChange = (tab) => {
  activeTab.value = tab;
  // Update URL query parameter without navigation
  router.replace({ 
    query: { 
      ...route.query, 
      tab: tab
    }
  });
};

// Items array with selected property
const items = [{
  label: 'Exterior',
  key: 'exterior',
  icon: 'i-mdi-home',
  content: 'Roofs and stuff',
  selected: activeTab.value === 0
}, {
  label: 'Interior',
  key: 'interior',
  icon: 'i-mdi-sofa',
  content: 'Beds and Baths and stuff',
  disabled: true,
  selected: activeTab.value === 1
}, {
  label: 'Appliances',
  key: 'appliances',
  icon: 'i-mdi-fridge',
  content: 'Dishwashers and refrigerators and stuff',
  disabled: false,
  selected: activeTab.value === 2
}];

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

const appliances = ref([])

appliances.value = [ {description: 'Dishwasher', key: "hjgdsfa82"}]

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
  icon: 'i-heroicons-chart-bar',
  to: './info/home-info'
}, {
  label: 'Protection',
  icon: 'i-heroicons-home',
  to: './info/protection'
}, {
  label: 'Exterior',
  icon: 'i-mdi-home',
  to: './info/exterior'
},
{
  label: 'Interior',
  icon: 'i-mdi-sofa',
  to: './info/interior'
}, {
  label: 'Appliances',
  icon:  'i-mdi-fridge',
  to: './info/appliances'
},
{
  label: 'Plumbing',
  icon: 'i-heroicons-home',
  to: './info/plumbing'
},
{
  label: 'HVAC',
  icon: 'i-heroicons-home',
  to: './info/hvac'
},
{
  label: 'Electrical',
  icon: 'i-heroicons-home',
  to: './info/electrical'
},
]

</script>

<template>
  <div v-if="home" class="space-y-4">
    <UHorizontalNavigation :links="links" class="border-b border-gray-200 dark:border-gray-800" />
    <article class="p-4 bg-white shadow-md rounded-md space-y-4">
      <UVerticalNavigation :links="sectionLinks" />
    </article>    
    <article class="p-4 bg-white shadow-md rounded-md">
      <UTabs 
        :items="items" 
        class="w-full"
        :default-index="activeTab"
        @change="handleTabChange"
      >
        <template #item="{ item }">
          <div v-if="item.key === 'exterior'" class="space-y-3">
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
          <div v-if="item.key === 'appliances'" class="space-y-3">
            <ApplianceList />

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
