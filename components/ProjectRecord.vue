<script setup>
import { onMounted, ref } from 'vue'
import { getDoc, doc } from 'firebase/firestore'

const { $db } = useNuxtApp();
const home = ref()
const props = defineProps({
  homeId: {
    type: String,
    required: true,
  },
  projectType: {
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
    <code v-if="home">{{ home }}</code>
    <h2>Type: {{ props.projectType }}</h2>

</template>

  
<style scoped>

</style>
