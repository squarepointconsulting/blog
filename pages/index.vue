<script setup>
import { onMounted, ref } from 'vue'

//import { onMounted } from "vue"
import { getDocs, collection } from 'firebase/firestore'

const { $db } = useNuxtApp();
const homeId = "FK9dzfK8PK7QRazTHn5f"

const propsRef = collection($db , "properties");
const home = ref()

const querySnapshot = await getDocs(propsRef)

onMounted(() => {
    querySnapshot.forEach((doc) => {
        home.value = doc.data()
    })
    
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
  <div v-if="home">
    <div class="subtitle">{{ home.address.street1 }} </div>
  </div>
  <div width="100%" class="space-y-4" v-if="home">
    <article class="p-4 bg-white shadow-md rounded-md">
      <div class="flex min-w-[393px] w-full">
        <div class="flex-1 p-4" >
          
        </div>
        <!-- Column 1 -->
        <div class="flex-1 p-4" >
          <div class="flex min-w-[100px] w-full">
          <img class="w-24 h-24 rounded-full object-fill"
            :src="home.imageUrl"
            alt="My Biggest Asset" />
        </div>
        </div>

        <!-- Column 2 -->
        <div class="flex-1 p-4">
          <div class="chart-container">
            <GaugeChart />           
          </div>
          <div class="font-bold text-center" >{{ home.villafactsScore }}</div>

        </div>

        <!-- Column 3 -->
        <div class="flex-1 p-4">
          <div class="chart-container">
            <LineChart />
          </div>
        </div>
      </div>

    </article>
    <article class="p-4 bg-white shadow-md rounded-md">
      <p class="mt-4 text-lg font-black">
        Current Asset Value: $1,230
      </p>
    </article>
    <article class="p-4 bg-white shadow-md rounded-md">
      <NuxtLink to="/score">
      <h2 class="text-lg font-bold">Level Up</h2>
      <p class="text-gray-700">Increase your VillaFacts Score to increase your net asset value. Complete these simple activities to build your profile.</p>
        </NuxtLink>
    </article>
    <article class="p-4 bg-white shadow-md rounded-md">
      <NuxtLink to="/invest">
        <h2 class="text-lg font-bold">Invest</h2>
      <p class="text-gray-700">Plan and track home improvement projects to maximize your costs basis.</p>
    </NuxtLink>
  </article>
    <article class="p-4 bg-white shadow-md rounded-md">
      <NuxtLink to="/advice">
        <h2 class="text-lg font-bold">Advice</h2>
      <p class="text-gray-700">GenAI Powered advice for homeowners about the best way to increase the value and lower the costs of your home.</p>
    </NuxtLink>
  </article>
  </div>
</template>

<style scoped>
.chart-container {
  height: 100px;
}
</style>
