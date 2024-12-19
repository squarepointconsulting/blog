<script setup>
import { useRoute } from 'vue-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore'

const route = useRoute();
const homeIdRef = useState('homeId')
const homeId = route.params.homeId;
homeIdRef.value = homeId;

const { $db } = useNuxtApp();
const docRef = doc($db, 'properties', homeId);
const home = useDocument(docRef)
const homeSource = ref()

const router = useRouter();

const isLoading = ref(false)
const isEditing = ref(false)

const openEditModal = async () => {
    isLoading.value = true

    try {
        // Simulate loading time - replace with actual data fetching
        await new Promise(resolve => setTimeout(resolve, 1000))
        isLoading.value = false
        isEditing.value = true
    } catch (error) {
        console.error('Error loading data:', error)
        isLoading.value = false
    }
}

const saveChanges = async () => {
    isLoading.value = true
    try {
        fireExtinguishers.value.basicInformation.fireExtinguishersPerFloor = selectedOption.value
        const docRef = doc($db, "properties", homeId);
        await updateDoc(docRef, {
            info: {
                protection: {
                    fireExtinguishers: {
                        ...fireExtinguishers.value
                    }
                }
            }
        }, { merge: true });
        isEditing.value = false
    } catch (error) {
        console.error('Error saving changes:', error)
    } finally {
        isLoading.value = false
    }
}

//const selectedOption = ref(fireExtinguishers.basicInformation.fireExtinguishersPerFloor || 'Some')
const selectedOption = ref('Some')

const fireExtinguishers = ref({
  basicInformation: {
    fireExtinguishersPerFloor: 'None',
  },
  inspections: [],
});

onMounted(() => {
  const docRef = doc($db, "properties", homeId);
  getDoc(docRef).then((docSnap) => {
    if (docSnap.exists()) {
      homeSource.value = docSnap.data()
      if (homeSource.value.info 
        && homeSource.value.info.protection 
        && homeSource.value.info.protection.fireExtinguishers) 
        {
        fireExtinguishers.value = {
          ...homeSource.value.info.protection.fireExtinguishers
        };
        selectedOption.value = fireExtinguishers.value.basicInformation.fireExtinguishersPerFloor
      }
      else {
        fireExtinguishers.value = {
          ...fireExtinguishers.value
        }
      }
    }
  })
})

</script>

<template>
    <div v-if="home" class="space-y-4">
        <article class="p-4 bg-white shadow-md rounded-md">
            <h2 class="text-lg font-bold flex items-center gap-3">
                <UButton icon="i-heroicons-arrow-left" variant="soft" color="gray" class="rounded-full h-8 w-8"
                    @click="() => router.back()" />
                Fire Extinguishers
            </h2>
        </article>
        <article class="p-4 bg-white shadow-md rounded-md">
            <div class="space-y-3 relative p-4 rounded-lg hover:bg-gray-50 cursor-pointer" @click="openEditModal">
                <UButton icon="i-heroicons-pencil" variant="soft" color="gray"
                    class="rounded-full h-8 w-8 absolute top-2 right-2" />
                <div>
                    <h2>Basic Information</h2>
                    <p>Fire extinguishers per floor</p>
                    <p>
                        {{ fireExtinguishers.basicInformation.fireExtinguishersPerFloor }}
                    </p>
                </div>
            </div>
        </article>
    </div>

    <div v-else class="space-y-4">
        <article class="p-4 bg-white shadow-md rounded-md">
            <p>Home not found ...</p>
        </article>
    </div>

    <!-- Loading Modal -->
    <UModal v-model="isLoading">
        <div class="p-4 flex items-center justify-center">
            <UIcon name="i-heroicons-arrow-path" class="animate-spin" />
            <span class="ml-2">Loading...</span>
        </div>
    </UModal>

    <!-- Edit Modal -->
    <UModal v-model="isEditing" :ui="{
        container: 'flex flex-col h-[90vh] max-w-2xl mx-auto',
        width: 'sm:max-w-2xl',
        padding: 'p-0'
    }">
        <div class="flex flex-col h-full">
            <!-- Header -->
            <div class="p-4 border-b">
                <h3 class="text-lg font-bold">Fire Extinguishers</h3>
                <h4>Basic Information</h4>
                <p class="text-sm text-gray-500">Fire extinguishers per floor</p>
                <p class="">Indicate if you have at least one fire extinguisher per floor in your home.</p>
            </div>

            <!-- Content (scrollable) -->
            <div class="flex-1 p-4 overflow-y-auto">
                <div class="space-y-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Fire extinguishers per floor
                    </label>
                    <div class="space-y-3">
                        <div v-for="option in ['All', 'Some', 'None']" :key="option" :class="[
                            'flex items-center justify-between p-4 rounded-lg border',
                            selectedOption === option ? 'border-green-500' : 'border-gray-200'
                        ]" @click="selectedOption = option">
                            <span class="text-base">{{ option }}</span>
                            <div :class="[
                                'w-6 h-6 rounded-full border-2 flex items-center justify-center',
                                selectedOption === option ? 'border-green-500' : 'border-gray-300'
                            ]">
                                <div v-if="selectedOption === option" class="w-3 h-3 rounded-full bg-green-500" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="p-4 border-t mt-auto">
                <div class="flex justify-end gap-2">
                    <UButton color="gray" variant="soft" label="Cancel" @click="isEditing = false" />
                    <UButton color="primary" label="Save" @click="saveChanges" />
                </div>
            </div>
        </div>
    </UModal>
</template>

<style scoped>
.animate-spin {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}
</style>
