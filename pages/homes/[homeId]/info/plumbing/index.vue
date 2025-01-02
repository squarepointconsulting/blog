<script setup>
import { useRoute } from 'vue-router';
import { doc } from 'firebase/firestore'

const route = useRoute();
const homeIdRef = useState('homeId')
const homeId = route.params.homeId;
homeIdRef.value = homeId;

const { $db } = useNuxtApp();
const docRef = doc($db, 'properties', homeId);
const home = useDocument(docRef)

const router = useRouter();

const sectionLinks = [{
  label: 'Pipes',
  icon: 'i-heroicons-home',
  to: 'plumbing/pipes'
}, {
  label: 'Water Heater',
  icon: 'i-heroicons-home',
  to: 'plumbing/water-heater'
}, {
  label: 'Plumbing Fixtures',
  icon: 'i-mdi-home',
  to: 'plumbing/plumbing-fixtures'
},
]

</script>

<template>
    <div v-if="home" class="space-y-4">
        <article class="p-4 bg-white shadow-md rounded-md">

            <h2 class="text-lg font-bold flex items-center gap-3">
                <UButton icon="i-heroicons-arrow-left" variant="soft" color="gray" class="rounded-full h-8 w-8"
                    @click="() => router.back()" />
                Plumbing
            </h2>

        </article>
        <article class="p-4 bg-white shadow-md rounded-md space-y-4">
            <UVerticalNavigation :links="sectionLinks" />
        </article>

    </div>
    <div v-else class="space-y-4">
        <article class="p-4 bg-white shadow-md rounded-md">
            <p>Home not found ...</p>
        </article>
    </div>
</template>
