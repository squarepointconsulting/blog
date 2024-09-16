<template>
    <div class="gauge-chart-container">

        <div class="relative">
            <!-- Main Content -->
            <div>
                <canvas ref="gaugeChart"></canvas>
            </div>

            <!-- Overlapping Div -->
            <div class="absolute bottom-12 left-30 text-black p-4 z-10">
                <p>90</p>
            </div>
        </div>
</div>  

</template>

<script setup>
import { onMounted, ref } from 'vue'
import { Chart, ArcElement, Tooltip, Title } from 'chart.js'

// Register Chart.js components
Chart.register(ArcElement, Tooltip, Title)

const gaugeChart = ref(null)

const renderGaugeChart = () => {
    const ctx = gaugeChart.value.getContext('2d')

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Low', 'Medium', 'High'], // Optional: Add labels if you need
            datasets: [
                {
                    data: [80, 20], // Your data (80% for current value, 20% for empty space)
                    backgroundColor: ['#55BF3B', '#DDDF0D', '#DF5353'], // Color bands (green, yellow, red)
                    borderWidth: 0, // No border between sections
                },
            ],
        },
        options: {
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
                    text: 'VillaFacts Score',
                },
                legend: {
                    display: false,
                },
            },
        },
    })
}

onMounted(() => {
    renderGaugeChart()
})
</script>

<style scoped>
.gauge-chart-container {
    width: 100%;
    height: 200px;
    position: relative;
}
</style>