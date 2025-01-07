<template>
<article class="p-4 bg-white shadow-md rounded-md flex justify-between items-start" v-for="home in homes" :key="home.id">
    <div>
        <NuxtLink :to="{ name: 'homes-homeId', params: {homeId: home.id }}">
            <h2 class="text-lg font-bold">{{ home.address.street1 }}</h2>
        </NuxtLink>
        <p class="text-gray-700">{{ Math.round(home.villaFactScore) }} </p>
    </div>
    <UButton @click="deleteHome(home.id)" label="Delete Home" class="bg-red-700" />
</article>
</template>

<script setup>
import { useCollection } from 'vuefire'
import { collection, query, where, deleteDoc, doc } from 'firebase/firestore'
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
    console.log(`All files and subfolders deleted from: ${storagePath}`);
  } catch (error) {
    console.error("Error deleting files:", error);
  }
}

async function deleteHome(homeId) {
    if (confirm('Are you sure you want to delete this home?') == true) {
        await deleteAllFiles(`properties/${homeId}`)
        await deleteDoc(doc($db, "properties", homeId))
        router.push('/profile');
    }
}

</script>