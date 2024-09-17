<template>
    <Doughnut :data="data" :options="options" />
</template>

<script lang="ts">
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'vue-chartjs'
// import * as chartConfig from '../plugins/gauge.js'

export const chartData = {
  labels: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs'],
  datasets: [
    {
      backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
      data: [140, 20, 80, 10]
    }
  ]
}

export const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
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