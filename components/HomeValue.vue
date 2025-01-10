<script setup>
import { onMounted, ref } from 'vue'
import { useCollection } from 'vuefire'
import { collection, query, orderBy, doc, getDoc, where, serverTimestamp, addDoc, getDocs } from 'firebase/firestore'

import { Chart, LineElement, PointElement, LineController, CategoryScale, LinearScale, Title, Tooltip } from 'chart.js'

// Register necessary Chart.js components
Chart.register(LineElement, PointElement, LineController, CategoryScale, LinearScale, Title, Tooltip)

const route = useRoute();
const homeId = route.params.homeId;
const { $db } = useNuxtApp();
const docRef = doc($db, 'properties', homeId);
const home = useDocument(docRef)
const valueRef = collection($db, 'properties', homeId, 'market_history');
const valueQuery = query(valueRef);
const values = useCollection(valueQuery);

const lineChart = ref(null)
const chartData = ref(
  {
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
  }
)

const renderLineChart = () => {
  const ctx = lineChart.value.getContext('2d')

  new Chart(ctx, {
    type: 'line',
    data: chartData.value,
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
        }, title: {
          display: true,
          text: 'Real Market Value',
        },
        tooltip: {
          enabled: true,
        },
      },
    },
  })
}

const isLoading = ref(true)

var labels = ref([])
var dataRealMarketValueLand = ref([])
var dataRealMarketValueStructures = ref([])
var dataTotalValue = ref([])
var dataTotalAssessedValue = ref([])

watch(
  () => home.value, 
  (newValue) => {
    if (newValue) {
      console.log('Document loaded:', newValue);

    const q = query(collection( $db, 'properties', homeId, 'market_history'));

    getDocs(q).then((querySnapshot) => {

      // chartData.value.labels = []
      // chartData.value.datasets = []
      querySnapshot.forEach((doc) => {
        labels.value.push(doc.id.substring(0, 4))
        dataRealMarketValueLand.value.push(doc.data().realMarketValueLand)
        dataRealMarketValueStructures.value.push(doc.data().realMarketValueStructures)
        dataTotalValue.value.push(parseInt(doc.data().realMarketValueLand) + parseInt(doc.data().realMarketValueStructures))
        dataTotalAssessedValue.value.push(doc.data().totalAssessedValue)
        
        console.log(doc.id, " => ", doc.data());
        // chartData.value = transformToChartData(doc.data())
      });
    }).then(() => {
      chartData.value.labels = labels
      chartData.value.datasets = [
        {
          label: 'Property Value',
          data: dataTotalValue.value,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderWidth: 2,
        },
        // {
        //   label: 'Structure Value',
        //   data: dataRealMarketValueStructures.value,  
        //   borderColor: 'rgba(255, 99, 132, 1)',
        //   backgroundColor: 'rgba(255, 99, 132, 0.2)',
        //   borderWidth: 2,
        // },
        {
          label: 'Total Assessed Value',
          data: dataTotalAssessedValue.value,
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderWidth: 2,
        }
      ]
      isLoading.value = false
      renderLineChart() 
    })
      
    }
  }
);

</script>

<template>
  <article v-if="true" class="p-4 bg-white shadow-md rounded-md">
    <div class="flex min-w-[350px] w-full">
      <div class="flex-1">
        <div class="chart-container-line">
          <canvas ref="lineChart" width="300"></canvas>
        </div>
      </div>
    </div>
  </article>
  <article v-else class="p-4 bg-white shadow-md rounded-md">
    <div class="flex w-full">
      <p>Loading...</p>
    </div>
  </article>
</template>


<style scoped>
.chart-container-line {
  width: 325px;
}
</style>