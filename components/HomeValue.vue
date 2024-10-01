<script setup>
import { onMounted, ref } from 'vue'
import { getDoc, doc } from 'firebase/firestore'
import LineChart from '~/components/LineChart.vue'

const { $db } = useNuxtApp();
const home = ref()
const props = defineProps({
  homeId: {
    type: String,
    required: true,
  },
});

onMounted(() => {
    const docRef = doc($db, "properties", props.homeId);
    getDoc(docRef).then ((docSnap) => {
        if (docSnap.exists()) {
            home.value = docSnap.data()
        } else {
            console.error("No such document!");
        }
    })    
})
</script>

<template>
      <article v-if="home"  class="p-4 bg-white shadow-md rounded-md">
        <div class="flex min-w-[350px] w-full">
          <div class="flex-1">
            <div class="chart-container-line">
              <LineChart />
            </div>
          </div>
        </div>
      </article>
    <article v-else  class="p-4 bg-white shadow-md rounded-md">
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
