<script setup>
import { onMounted, ref } from 'vue'

//import { onMounted } from "vue"
import { getDoc, doc } from 'firebase/firestore'

const { $db } = useNuxtApp();
const homeId = "FK9dzfK8PK7QRazTHn5f"
const home = ref()
const docRef = doc($db, "properties", homeId);
const docSnap = await getDoc(docRef);

onMounted(() => {
  if (docSnap.exists()) {
    home.value = docSnap.data()
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }
})

import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { Bar } from 'vue-chartjs'
import GaugeChart from '~/components/GaugeChart.vue'
import LineChart from '~/components/LineChart.vue'

// Register
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const chartData = ref({
  labels: ['January', 'February', 'March', 'April', 'May'],
  datasets: [
    {
      label: 'Net Home Value',
      backgroundColor: '#f87979',
      data: [400000, 401000, 402000, 400500, 450000],
    },
  ],
})
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: true,
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
