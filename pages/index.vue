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
  <div class="space-y-4">
  <HomeSummary />
  <HomeValue />
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
