<script setup>

import { useRoute } from 'vue-router';
// import { useCollection } from 'vuefire'
// import { collection, doc} from 'firebase/firestore'
import { doc, getDoc } from 'firebase/firestore'

const route = useRoute();
const homeId = route.params.id;
const { $db } = useNuxtApp();
const docRef = doc($db, 'properties', homeId);
const home = useDocument(docRef)
const homeSource = ref()
const router = useRouter();
const isEditing = ref(false);

const editHome = ref({
    address: {
        city: "",
        state: "",
        street1: "",
        street2: "",
        zip: "",
    },
    currentAppraisedValue: 0,
    geoip: "",
    villaFactScore: 0,
    imageUrl: "",
    ownerId: "",
    updated_at: null,
    project_records: [],
})

// When homeSource is updated
watch(homeSource, (homeSource) => {
    // Update the editHome with the appropriate values
    editHome.value = {
        ...homeSource,
    }
})

const props = defineProps({
    homeId: {
        type: String,
        required: true,
    },
});

async function updateHome() {
    const docRef = doc($db, "properties", props.homeId);
    await updateDoc(docRef, {
        ...editHome.value,
    })
    isEditing.value = false
}







const items = [  {
  label: 'Exterior',
  key: 'exterior',
  icon: 'i-pajamas-issue-type-objective',
  content: 'Roofs and stuff'
}, {
  label: 'Interior',
  key: 'interior',
  icon: 'i-pajamas-issue-type-objective',
  content: 'Beds and Baths and stuff', 
  disabled: true,
}, {
  label: 'Appliances',
  key: 'appliances',
  icon: 'i-pajamas-issue-type-objective',
  content: 'Dishwashers and refrigerators and stuff',
  disabled: true,
},]

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

const sections = [{
  label: 'Roof',
  icon: 'i-heroicons-information-circle',
  defaultOpen: true,
  slot: 'roof-info'
}, {
  label: 'Installation',
  icon: 'i-heroicons-arrow-down-tray',
  defaultOpen: false,
  slot: 'installation'
}, {
  label: 'Siding',
  icon: 'i-heroicons-eye-dropper',
  defaultOpen: false,
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
}, {
  label: 'Paint',
  icon: 'i-heroicons-rectangle-group',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
}, ]



onMounted(() => {
    const docRef = doc($db, "properties", homeId);
    getDoc(docRef).then((docSnap) => {
        if (docSnap.exists()) {
            homeSource.value = docSnap.data()
        } else {
            console.error("No such document!");
        }
    })
})


</script>

<template>
  <div v-if="home" class="space-y-4">
    <HomeSummary :homeId="homeId" />
    <article class="p-4 bg-white shadow-md rounded-md">

      <UTabs :items="items" class="w-full">
        <template #item="{ item }">
          <div v-if="item.key === 'exterior'" class="space-y-3">
            <UAccordion :items="sections" color="gray">
    <template #item="{ item }">
      <p class="italic text-gray-900 dark:text-white text-center">
        {{ item.description }}
      </p>
    </template>

    <template #roof-info>
        <article v-if="homeSource" class="p-4 bg-white shadow-md rounded-md relative">
            <div class="flex flex-col space-y-2">
                <UInput v-model="homeSource.address.street1" type="text" placeholder="Street 1"
                    class="p-2 border-gray-300 rounded-md" />
                <UInput v-model="homeSource.address.street2" type="text" placeholder="Street 2"
                    class="p-2  border-gray-300 rounded-md" />
                <UInput v-model="homeSource.address.city" type="text" placeholder="City"
                    class="p-2 border-gray-300 rounded-md" />
                <UInput v-model="homeSource.address.state" type="text" placeholder="State"
                    class="p-2 border-gray-300 rounded-md" />
                <UInput v-model="homeSource.address.zip" type="text" placeholder="Zip Code"
                    class="p-2 border-gray-300 rounded-md" />
            </div>
            <div class="absolute top-2 right-2">
                <UButton @click="isEditing = false" icon="i-heroicons-x-circle" class="focus:outline-none">
                </UButton>
            </div>
            <div class="flex place-content-center space-x-4">
                <!-- Right slot for icons -->
                <slot name="right-icons">
                    <span>
                        <UButton @click="updateHome" icon="i-heroicons-check-circle" class="" />
                    </span>
                    <span>
                        <UButton @click="deleteHome" label="Delete Home" class=" bg-red-700 " />
                    </span>
                </slot>
            </div>

            <!-- Hidden File Input -->
            <input ref="fileInput" type="file" class="hidden" @change="handleFileChange" />
        </article>

        
    </template>

    <template #installation="{ description }">
      <div class="flex flex-col justify-center items-center gap-1 mb-4">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white">
          Installation
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Install <code>@nuxt/ui</code> dependency to your project:
        </p>
        <p>
          {{ description }}
        </p>
      </div>

      <div class="flex flex-col items-center">
        <code>$ npx nuxi@latest module add ui</code>
      </div>
    </template>
  </UAccordion>


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
