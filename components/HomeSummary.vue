<script setup>
import { onMounted, ref } from 'vue'
import { getDoc, doc } from 'firebase/firestore'
import GaugeChart from '~/components/GaugeChart.vue'

const { $db } = useNuxtApp();
const home = ref()
const props = defineProps({
  homeId: {
    type: Object,
    required: true,
  },
});

onMounted(() => {
    const docRef = doc($db, "properties", props.homeId);
    getDoc(docRef).then ((docSnap) => {
        if (docSnap.exists()) {
            home.value = docSnap.data()
        } else {
            console.error("No such document!");
        }
    })    
})
</script>
<template>
    <article v-if="home"  class="p-4 bg-white shadow-md rounded-md">
    <div class="flex w-full">
        <!-- Inner Div 1 -->
        <div class="flex-1 flex flex-col justify-center items-center">
        <div class="w-full flex justify-center items-center">
            <p><img class="w-24 h-24 rounded-full object-fill" style="text-align: center;" :src="home.imageUrl"
                alt="My Biggest Asset" /></p>
        </div>
        <!-- Row 2 -->
        <div class="w-full flex justify-center items-center p-1">
            <p class="">{{ home.address.street1 }}</p>
        </div>
        </div>

        <!-- Inner Div 2 -->
        <div class="flex-1 flex flex-col justify-center items-center">
        <!-- Row 1 -->
        <div class="w-full flex justify-center items-center">
            <div class="chart-container">
            <GaugeChart />
            </div>
        </div>
        <!-- Row 2 -->
        <div class="w-full flex justify-center items-center">
            <p class="font-bold text-center">{{ home.villafactScore }}</p>
        </div>
        </div>
    </div>
    </article>
    <article v-else  class="p-4 bg-white shadow-md rounded-md">
        <div class="flex w-full">
            <p>Loading...</p>
            </div>
    </article>
</template>
  
<style scoped>
.chart-container {
  height: 100px;
}
</style>
