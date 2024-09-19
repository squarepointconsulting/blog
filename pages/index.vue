<script setup>
import { onMounted, ref } from 'vue'

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


//   <--! BlogPostList -->
const isEditing = ref(false)

const formData = ref({
  name: '1973 NW Hill Point Dr',
  email: 'john.doe@example.com',
  phone: '+1234567890',
})

const saveChanges = () => {
  isEditing.value = false
  // Here, you can add any logic for saving the data to a server
  console.log('Updated profile data:', formData.value)
}
</script>



<template>
  <div>
    <div class="title">Maximizing the value of your home</div>
    <div class="subtitle">{{ formData.name }} </div>
  </div>
  <div width="100%" class="space-y-4">
    <article class="p-4 bg-white shadow-md rounded-md">
      <div class="flex min-w-[393px] w-full">
        <!-- Column 1 -->
        <div class="flex-1 p-4" >
          <div class="flex min-w-[100px] w-full">
          <img class="w-24 h-24 rounded-full object-fill"
            src="https://photos.zillowstatic.com/fp/998244c38c42954e637ea8b153cb9c7c-cc_ft_576.jpg"
            alt="My Biggest Asset" />
          
        </div><UButton color="primary" @click="isEditing = true" icon="i-heroicons-pencil-square" />
        </div>

        <!-- Column 2 -->
        <div class="flex-1 p-4">
          <div class="chart-container">
            <GaugeChart />           
          </div>
          <div class="font-bold text-center" >675</div>

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

  <div>
    <UModal v-model="isEditing">
      <h3>Edit Profile</h3>
      <UInput label="Name" v-model="formData.name" placeholder="Enter your name" />
      <UInput label="Email" v-model="formData.email" placeholder="Enter your email" />
      <UInput label="Phone" v-model="formData.phone" placeholder="Enter your phone number" />
      <UButton color="red" @click="isEditing = false">
        Cancel
      </UButton>&nbsp;
      <UButton color="primary" @click="saveChanges">
        Save Changes
      </UButton>

    </UModal>
  </div>
</template>

<style scoped>
.chart-container {
  height: 100px;
}
</style>
