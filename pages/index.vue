<script setup>
import { onMounted, ref } from 'vue'
import { collection, query, where, getDocs } from 'firebase/firestore'

const homeId = ref("")
const user = await getCurrentUser()
const { $db } = useNuxtApp();
const q = query(collection($db, "properties"), where("ownerId", "==", user.uid));
const querySnapshot = await getDocs(q);
const router = useRouter();

function navigateToSettingsPage() {
  
}
onMounted(() => {
  // TODO: This is dumb. Allow user to choose "default" home.   
  querySnapshot.forEach((doc) => {
    router.push({ name: 'homes-homeId', params: {homeId: doc.id }});
    //homeId.value = doc.id;
  })
})

</script>
<template>
  <div class="space-y-4" v-if="homeId" >
  <HomeSummary :homeId="homeId" />
  <HomeValue :homeId="homeId" />
  <article class="p-4 bg-white shadow-md rounded-md">
      <NuxtLink to="/score">
        <h2 class="text-lg font-bold">Level Up
          <UIcon name="i-heroicons-chevron-double-right" class="w-4 h-4" />
        </h2>
        <p class="text-gray-700">Increase your home's VillaFact Score to increase your net asset value. Complete these
          simple
          activities to build your profile.</p>
      </NuxtLink>
    </article>
    <article class="p-4 bg-white shadow-md rounded-md">
      <NuxtLink to="/invest">
        <h2 class="text-lg font-bold">Invest
          <UIcon name="i-heroicons-chevron-double-right" class="w-4 h-4" />
        </h2>
        <p class="text-gray-700">Plan and track home improvement projects to maximize your costs basis.</p>
      </NuxtLink>
    </article>
    <article class="p-4 bg-white shadow-md rounded-md">
      <NuxtLink to="/advice">
        <h2 class="text-lg font-bold">Advice
          <UIcon name="i-heroicons-chevron-double-right" class="w-4 h-4" />
        </h2>
        <p class="text-gray-700">GenAI Powered advice for homeowners about the best way to increase the value and lower
          the costs of your home.</p>
      </NuxtLink>
    </article>
  </div>
</template>
<style scoped>
</style>
