<template>
    <Doughnut :data="data" :options="options" />
</template>

<script lang="ts">
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'vue-chartjs'
// import * as chartConfig from '../plugins/gauge.js'

export const chartData = {
    labels: ['Low', 'Medium', 'High'], // Optional: Add labels if you need
    datasets: [
        {
            data: [65, 35], // Your data (80% for current value, 20% for empty space)
            backgroundColor: ['#55BF3B', '#DDDF0D', '#DF5353'], // Color bands (green, yellow, red)
            borderWidth: 0, // No border between sections
        },
    ],
}

export const chartOptions = {
    rotation: -90, // Start angle of the gauge
      circumference: 180, // End angle of the gauge (half circle)
      cutout: '80%', // Inner cutout of the doughnut chart (gives it the "gauge" look)
      responsive: true,
      plugins: {
        tooltip: {
          enabled: false, // Disable tooltips
        },
        title: {
          display: true,
          text: 'VillaFact Score',
        },
        legend: {
          display: false,
        },
      }
}

export const chartConfig = {
    data: chartData,
    options: chartOptions
}


ChartJS.register(ArcElement, Tooltip, Legend)

export default {
    name: 'App',
    components: {
        Doughnut
    },
    data() {
        return chartConfig
    }
}
</script>