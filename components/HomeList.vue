<template>
<article class="p-4 bg-white shadow-md rounded-md" v-for="home in homes" :key="home.id">
    <NuxtLink :to="{ name: 'homes-homeId', params: {homeId: home.id }}">
        <h2 class="text-lg font-bold">{{ home.address.street1 }}</h2>
        <p class="text-gray-700">{{ Math.round(home.villaFactScore) }} </p>
    </NuxtLink>
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
</script>