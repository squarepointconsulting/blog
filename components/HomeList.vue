<template>
<article class="p-4 bg-white shadow-md rounded-md" v-for="home in homes" :key="home.id">
    <NuxtLink :to="{ name: 'homes-homeId', params: {homeId: home.id }}">
        <h2 class="text-lg font-bold">{{ home.address.street1 }}</h2>
    </NuxtLink>
        <p class="text-gray-700">{{ Math.round(home.villaFactScore) }} </p>
        <span>
            <UButton @click="deleteHome(home.id)" label="Delete Home" class=" bg-red-700 " />
        </span>
</article>
</template>

<script setup>
import { useCollection } from 'vuefire'
import { collection, query, where } from 'firebase/firestore'
const { $db } = useNuxtApp();
const user = useCurrentUser()
const uid = user.value.uid // 'ggpCEQb37sXNsOQ2q3Z2WyGQaRt1'
const q = query(collection($db, "properties"), where("ownerId", "==", uid));
const homes = useCollection(q, { ssrKey: 'homes' })

async function deleteHome(homeId) {
    await confirm('Are you sure you want to delete this home?')
    await alert('Home NOT deleted yet. Implement file cleanup code first.')
    await deleteDoc(doc($db, "properties", homeId))
    router.push('/profile');
}

</script>