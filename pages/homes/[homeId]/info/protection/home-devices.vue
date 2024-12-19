<script setup>
import { useRoute } from 'vue-router';
import { cloneDeep } from 'lodash'


import { doc, getDoc, updateDoc } from 'firebase/firestore'
const route = useRoute();
const homeIdRef = useState('homeId')
const homeId = route.params.homeId;
homeIdRef.value = homeId;
const { $db } = useNuxtApp();
const homeSource = ref()
const router = useRouter();
const isLoading = ref(false)
const isEditing = ref(false)

const openBasicEditModal = async () => {
    isLoading.value = true
    try {
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
        const docRef = doc($db, "properties", homeId);
        await updateDoc(docRef, {
            info: {
                protection: {
                    homeDevices: {
                        ...homeDevicesEdit.value
                    }
                }
            }
        }, { merge: true });
        homeDevicesSource.value = cloneDeep(homeDevicesEdit.value)
        isEditing.value = false
    } catch (error) {
        console.error('Error saving changes:', error)
    } finally {
        isLoading.value = false
    }
}

const homeDevicesSource = ref()
const homeDevicesEdit = ref()
const homeDevicesTemplate = ref({
    basicInformation: {
        brand: 'Nest',
        smartSystem: 'Yes',
        centrallyMonitored: 'Yes',
    },
    detailedInformation: {
        numberOfSmartThermostats: 3,
        numberOfLeakSensors: 0,
        numberOfOtherSensors: 0,
    },
});

onMounted(() => {
    const docRef = doc($db, "properties", homeId);
    getDoc(docRef).then((docSnap) => {
        if (docSnap.exists()) {
            homeSource.value = docSnap.data()
            if (homeSource.value.info && homeSource.value.info.protection && homeSource.value.info.protection.homeDevices) {
                homeDevicesSource.value =  homeSource.value.info.protection.homeDevices
            }
            else {
                homeDevicesSource.value = {
                    ...homeDevicesTemplate.value
                }
            }
        }
        else {
            homeDevicesSource.value = {
                    ...homeDevicesTemplate.value
                }
        }
        homeDevicesEdit.value = cloneDeep(homeDevicesSource.value)

    })
})

watch(() => homeDevicesSource, (newValue, oldValue) => {
  console.log('homeDevicesSource changed:', {
    new: newValue,
    old: oldValue,
    timestamp: new Date().toISOString()
  })
}, { deep: true }) // Add deep: true if homeDevicesSource is an object or array


const cancelChanges = () => {
    homeDevicesEdit.value = cloneDeep(homeDevicesSource.value)
    isEditing.value = false
}

</script>

<template>
    <div v-if="homeSource" class="space-y-4">
        <article class="p-4 bg-white shadow-md rounded-md">
            <h2 class="text-lg font-bold flex items-center gap-3">
                <UButton icon="i-heroicons-arrow-left" variant="soft" color="gray" class="rounded-full h-8 w-8"
                    @click="() => router.back()" />
                    Home Devices
            </h2>
        </article>
        <article class="p-4 bg-white shadow-md rounded-md">
            <div class="space-y-3 relative p-4 rounded-lg hover:bg-gray-50 cursor-pointer" @click="openBasicEditModal">
                <UButton icon="i-heroicons-pencil" variant="soft" color="gray"
                    class="rounded-full h-8 w-8 absolute top-2 right-2" />
                <div>
                    <h2 class="text-lg font-bold">Basic Information</h2>
                    <p>Brand</p>
                    <p class="text-gray-500">
                        {{ homeDevicesSource.basicInformation.brand }}
                    </p>
                    <p>Smart System</p>
                    <p class="text-gray-500">
                        {{ homeDevicesSource.basicInformation.smartSystem }}
                    </p>
                    <p>Centrally Monitored</p>
                    <p class="text-gray-500">
                        {{ homeDevicesSource.basicInformation.centrallyMonitored }}
                    </p>
                </div>
            </div>
        </article>
    </div>

    <div v-else class="space-y-4">
        <article class="p-4 bg-white shadow-md rounded-md">
            <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-arrow-path" class="animate-spin h-5 w-5" />
                <p>Loading...</p>
            </div>
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
    <UModal v-model="isEditing" >
        <div class="flex flex-col h-full">
            <!-- Header -->
            <div class="p-4 border-b">
                <h3 class="text-lg font-bold">Home Devices</h3>
                <h4>Basic Information</h4>
            </div>

            <!-- Content (scrollable) -->
            <div class="flex-1 p-4 overflow-y-auto space-y-4">
                <div class="space-y-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Brand
                    </label>
                    <div class="space-y-3">
                        <div v-for="option in ['Google', 'Ring', 'Notion', 'Mixed', 'Other']" :key="option" :class="[
                            'flex items-center justify-between p-4 rounded-lg border',
                            homeDevicesEdit.basicInformation.brand === option ? 'border-blue-500' : 'border-gray-200'
                        ]" @click="console.log('help'); homeDevicesEdit.basicInformation.brand = option">
                            <span class="text-base">{{ option }}</span>
                            <div :class="[
                                'w-6 h-6 rounded-full border-2 flex items-center justify-center',
                                homeDevicesEdit.basicInformation.brand === option ? 'border-blue-500' : 'border-gray-300'
                            ]">
                                <div v-if="homeDevicesEdit.basicInformation.brand === option" class="w-3 h-3 rounded-full bg-blue-500" />
                            </div>
                        </div>
                    </div>

                </div>
                <div class="space-y-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Smart System
                    </label>
                    <div class="space-y-3">
                        <div v-for="option in ['Yes', 'No']" :key="option" :class="[
                            'flex items-center justify-between p-4 rounded-lg border',
                            homeDevicesEdit.basicInformation.smartSystem === option ? 'border-blue-500' : 'border-gray-200'
                        ]" @click="homeDevicesEdit.basicInformation.smartSystem = option">
                            <span class="text-base">{{ option }}</span>
                            <div :class="[
                                'w-6 h-6 rounded-full border-2 flex items-center justify-center',
                                homeDevicesEdit.basicInformation.smartSystem === option ? 'border-blue-500' : 'border-gray-300'
                            ]">
                                <div v-if="homeDevicesEdit.basicInformation.smartSystem === option" class="w-3 h-3 rounded-full bg-blue-500" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="space-y-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Centrally Monitored
                    </label>
                    <div class="space-y-3">
                        <div v-for="option in ['Yes', 'No']" :key="option" :class="[
                            'flex items-center justify-between p-4 rounded-lg border',
                            homeDevicesEdit.basicInformation.centrallyMonitored === option ? 'border-blue-500' : 'border-gray-200'
                        ]" @click="homeDevicesEdit.basicInformation.centrallyMonitored = option">
                            <span class="text-base">{{ option }}</span>
                            <div :class="[
                                'w-6 h-6 rounded-full border-2 flex items-center justify-center',
                                homeDevicesEdit.basicInformation.centrallyMonitored === option ? 'border-blue-500' : 'border-gray-300'
                            ]">
                                <div v-if="homeDevicesEdit.basicInformation.centrallyMonitored === option" class="w-3 h-3 rounded-full bg-blue-500" />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div class="p-4 border-t mt-auto">
                <div class="flex justify-end gap-2">
                    <UButton color="gray" variant="soft" label="Cancel" @click="cancelChanges" />
                    <UButton color="blue" label="Save" @click="saveChanges" />
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
