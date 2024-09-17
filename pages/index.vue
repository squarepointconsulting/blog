<template>
  <main>
    <TheHero>
      <div class="title">Maximizing the value of your home</div>
      <div class="subtitle">{{ formData.name }} </div>

      <div class="grid grid-cols-5 gap-6 p-4 bg-white shadow-md rounded-lg border border-col">

        <!-- Left Column: Avatar and Label -->
        <div class="flex items-center space-x-4" >
          <img class="w-24 h-24 rounded-full object-fill"
            src="https://photos.zillowstatic.com/fp/998244c38c42954e637ea8b153cb9c7c-cc_ft_576.jpg" alt="User Avatar" />
          &nbsp;
          <!-- Edit Button -->
          <UButton color="primary" @click="isEditing = true" icon="i-heroicons-pencil-square" />
        </div>

        <!-- Center Column: Current Score Image -->
        <div class="flex justify-center items-center">
          <GaugeChart  />
        </div>

        <!-- Right Column: Score Trend Chart and Asset Value -->
        <div class="flex flex-col items-center justify-center col-span-3">
          <div class="chart-container">
            <LineChart />
          </div>
          <p class="mt-4 text-lg font-semibold font-black">
            Current Asset Value: $1,230
          </p>
        </div>
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
      <BlogPostList />
    </TheHero>


  </main>


</template>

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

<style scoped>
.chart-container {
  height: 100px;
  width: 350px;
}
</style>