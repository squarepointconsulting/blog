<template>
<article class="p-4 bg-white shadow-md rounded-md flex justify-between items-start" v-for="home in homes" :key="home.id">
    <div class="flex flex-col">
        <NuxtLink :to="{ name: 'homes-homeId', params: {homeId: home.id }}">
            <h2 class="text-lg font-bold">{{ home.address.street1 }}</h2>
        </NuxtLink>
        <p class="text-gray-700">{{ Math.round(home.villaFactScore) }} </p>
    </div>
    <div>
        <UButton 
            @click="deleteHome(home.id)" 
            label="Delete Home" 
            class="bg-red-700 hover:bg-red-700 active:bg-red-700"
        >
            <UIcon name="i-heroicons-trash" class="text-white" />
        </UButton>
    </div>

</article>
</template>

<script setup>
import { useCollection } from 'vuefire'
import { collection, query, where, deleteDoc, doc, getDocs } from 'firebase/firestore'
import { ref, deleteObject, listAll } from 'firebase/storage'
const { $db, $storage } = useNuxtApp();
const user = useCurrentUser()
const uid = user.value.uid 
const q = query(collection($db, "properties"), where("ownerId", "==", uid));
const homes = useCollection(q, { ssrKey: 'homes' })

async function deleteAllFiles(storagePath) {
  const storageRef = ref($storage, storagePath);

  try {
    const result = await listAll(storageRef);
    for (const fileRef of result.items) {
      await deleteObject(fileRef);
    }

    for (const folderRef of result.prefixes) {
      await deleteAllFiles(folderRef.fullPath);
    }
  } catch (error) {
    console.error("Error deleting files:", error);
  }
}

const deleteHomeAndSubcollections = async (homeId) => {
    const propertyRef = doc($db, 'properties', homeId);
    
    // Get all subcollections
    const collections = await getDocs(collection($db, 'properties', homeId, 'villafact_records'));
    
    // Delete all documents in subcollections
    const deleteSubcollections = collections.docs.map(async (doc) => {
        await deleteDoc(doc.ref);
    });
    
    // Wait for all subcollection deletions to complete
    await Promise.all(deleteSubcollections);
    
    // Finally delete the main document
    await deleteDoc(propertyRef);
}


async function deleteHome(homeId) {
    if (confirm('Are you sure you want to delete this home?') == true) {
        await deleteAllFiles(`properties/${homeId}`)
        try {
        await deleteHomeAndSubcollections(homeId);
        console.log(`Home ${homeId} deleted successfully`);
        } catch (error) {
            console.error('Error deleting home:', error);
        }
    }
}

</script>