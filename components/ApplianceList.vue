<script setup>
import { useRoute } from 'vue-router';
import { useCollection } from 'vuefire'
import { collection, query, orderBy, doc, where, serverTimestamp, addDoc } from 'firebase/firestore'

const route = useRoute();
const router = useRouter();
const homeId = route.params.homeId;
const { $db } = useNuxtApp();
const docRef = doc($db, 'properties', homeId);
const home = useDocument(docRef)
const appliancesRef = collection($db, 'properties', homeId, 'appliances');
const appliancesQuery = query(appliancesRef, orderBy('category', 'asc'));
const appliances = useCollection(appliancesQuery);

const showWizard = ref(false);

async function addAppliance() {
  const user = await useCurrentUser()
  const updated_at_timestamp = serverTimestamp()
  const applianceRecord = {
    category: "Dishwasher",
    manufacturer: "Maytag",
    model: "",
    serialNumber: "",
    dateOfPurchase: new Date(2023, 12, 15),
    purchaseLocation: "",
    createdAt: updated_at_timestamp,
    updatedAt: updated_at_timestamp,
    createdByUid: user.value.uid,
    createdByDisplayName: user.value.displayName,
    updatedByUid: user.value.uid,
    updatedByDisplayName: user.value.displayName,
    imageUrl: "https://placehold.co/60x60?text=icon",
    attachments: [],
  }
  const docRef = await addDoc(collection($db, "properties", homeId, "appliances"), applianceRecord);
  router.push(`/homes/${homeId}/appliances/`);
}

</script>

<template>

  <div class="space-y-4">

    <UButton @click="router.push(`/homes/${homeId}/appliances/new`)" class="bg-blue-500 text-white hover:bg-blue-600">
      Add New Appliance
    </UButton>
  </div>

  <div v-if="appliances && appliances.length" class="space-y-4">


    <article class="p-4 bg-gray-100 shadow-md rounded-md" v-for="appliance in appliances" :key="appliance.id">
      <NuxtLink :to="`/homes/${homeId}/appliances/${appliance.id}`"
      class="text-blue-600 hover:text-blue-800 text-sm mt-1"> 
      <div class="flex items-center space-x-4">
       
        <!-- Image Container -->
        <div class="flex-shrink-0">
<img
              class="w-16 h-16 rounded-lg object-cover bg-white" :src="appliance.imageUrl" alt="Appliance Avatar" />



        </div>

        <!-- Content Container -->
        <div class="flex-grow">
          <div class="flex flex-col">
            <p class="font-medium text-gray-900">{{ appliance.manufacturer }}</p>
            <p class="text-gray-600">{{ appliance.category }}</p>
          </div>
        </div>
   
      </div>
    </NuxtLink>
    </article>
  </div>
  <UModal v-model="showWizard" size="2xl">
    <ApplianceWizard @complete="showWizard = false" />
  </UModal>
</template>