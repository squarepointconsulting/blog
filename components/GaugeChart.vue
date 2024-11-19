<template>
    <Doughnut :data="chartData" :options="chartOptions" />
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'vue-chartjs'

ChartJS.register(ArcElement, Tooltip, Legend)

export default defineComponent({
    name: 'App',
    components: {
        Doughnut
    },
    props: {
        villaFactScore: {
            type: Number,
            required: true
        }
    },
    setup(props) {
        const chartData = computed(() => ({
            labels: ['Low', 'Medium', 'High'],
            datasets: [
                {
                    data: [Math.round(props.villaFactScore / 10), 100 - Math.round(props.villaFactScore / 10)],
                    backgroundColor: ['#55BF3B', '#DDDF0D', '#DF5353'],
                    borderWidth: 0,
                },
            ],
        }));

        const chartOptions = {
            rotation: -90,
            circumference: 180,
            cutout: '80%',
            responsive: true,
            plugins: {
                tooltip: {
                    enabled: false,
                },
                title: {
                    display: true,
                    text: 'VillaFact Score',
                },
                legend: {
                    display: false,
                },
            }
        };

        return {
            chartData,
            chartOptions
        }
    }
})
</script>