<script setup>
import { onMounted, ref } from 'vue'
import { useCollection } from 'vuefire'
import { collection, query, where, getDocs } from 'firebase/firestore'



// const homeId = route.params.id;
// find the home id for the "default" home for this user.
// for now, that is just the first home for this user. 
const homeId = ref("")
//const homeId = ref("FK9dzfK8PK7QRazTHn5f")
const user = await getCurrentUser()
console.log(`user.uid: ${user.uid}`)

const { $db } = useNuxtApp();
const q = query(collection($db, "properties"), where("ownerId", "==", user.uid));
const querySnapshot = await getDocs(q);
console.log(querySnapshot.empty)



// homeId.value = getDocs(q).then((querySnapshot) => {
//   console.log(querySnapshot)
//   if (!querySnapshot.empty) {
//     return querySnapshot[0].id
//   }
//  })


//homeId.value = homes.first.id
//console.log(`homeId.value: ${ homeId.value}`)

onMounted(() => {
    querySnapshot.forEach((doc) => {
      homeId.value = doc.id;
      console.log(doc.id);    
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
