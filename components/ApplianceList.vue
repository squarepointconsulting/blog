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

async function addAppliance() {
  const user = await useCurrentUser()
  console.log(user.value)
  const updated_at_timestamp = serverTimestamp()
  const applianceRecord = {
    category: "Dishwasher",
    manufacturer: "Maytag",
    model: "",
    serial_number: "",
    timestamp: updated_at_timestamp,
    completedByUserUid: user.value.uid,
    completedByUserDisplayName: user.value.displayName,
    attachments: [],
  }
  // Get a reference to the home document. Or do we have that already?

  console.log(applianceRecord)
  const docRef = await addDoc(collection($db, "properties", homeId, "appliances"), applianceRecord);
  console.log("Document written with ID: ", docRef.id);
  router.push(`./appliances/${docRef.id}`); // Adjust the path as necessary

}

</script>

<template>

  <div class="space-y-4">

    <article>
      <UButton @click="addAppliance" class="bg-blue-500 text-white hover:bg-blue-600">
      Add New Appliance
      </UButton>
    </article>
  </div>

  <div v-if="appliances && appliances.length" class="space-y-4">


    <article class="p-4 bg-white shadow-md rounded-md" v-for="appliance in appliances" :key="appliance.id">
      <h2 class="text-lg font-semibold">{{ appliance.name }}</h2> <!-- Display appliance name -->
      <p><strong>Manufacturer:</strong> {{ appliance.manufacturer }}</p> <!-- Display manufacturer -->
      <p><strong>Category:</strong> {{ appliance.category }}</p> <!-- Display category -->
      <p><strong>Description:</strong> {{ appliance.description }}</p> <!-- Display description -->
      <NuxtLink :to="`./appliances/${appliance.id}`" class="text-blue-600 hover:text-blue-800 hover:underline">
        View Details
      </NuxtLink> <!-- Link to appliance details -->
    </article>
  </div>
</template>