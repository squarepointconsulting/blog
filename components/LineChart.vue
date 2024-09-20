<template>
      <canvas ref="lineChart" width="300"></canvas>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { Chart, LineElement, PointElement, LineController, CategoryScale, LinearScale, Title, Tooltip } from 'chart.js'
  
  // Register necessary Chart.js components
  Chart.register(LineElement, PointElement, LineController, CategoryScale, LinearScale, Title, Tooltip)
  
  const lineChart = ref(null)
  
  const renderLineChart = () => {
    const ctx = lineChart.value.getContext('2d')
  
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
          {
            label: 'Net Asset Value',
            data: [130000, 150000, 140000, 160000, 180000, 170000],
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            beginAtZero: true,
          },
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
            legend: {
          display: false, // This hides the legend
        },title: {
            display: true,
            text: 'Net Asset Value',
          },
          tooltip: {
            enabled: true,
          },
        },
      },
    })
  }
  
  onMounted(() => {
    renderLineChart()
  })
  </script>
  
  <style scoped>
  .line-chart-container {
    width: 100%;
    height: 150px;
    position: relative;
  }
  </style>