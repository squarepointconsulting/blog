<script setup>
import { useRoute } from 'vue-router'
import cloneDeep from 'lodash-es/cloneDeep'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
const route = useRoute()
const homeIdRef = useState('homeId')
const homeId = route.params.homeId;
homeIdRef.value = homeId
const { $db } = useNuxtApp()
const router = useRouter()
const editType = ref('basic')
const isLoading = ref(false)
//const isLoadingDetailed = ref(false)
const isEditing = ref(false)
// const isEditingDetailed = ref(false)
const openBasicEditModal = async () => {
    editType.value = 'basic'
    isEditing.value = true
}

const openDetailedEditModal = async () => {
    editType.value = 'detailed'
    isEditing.value = true
}

const saveChanges = async () => {
    isLoading.value = true
    try {
        const docRef = doc($db, "properties", homeId);
        await updateDoc(docRef, {
            info: {
                protection: {
                    homeDevices: {
                        ...pageEdit.value
                    }
                }
            }
        }, { merge: true });
        pageSource.value = cloneDeep(pageEdit.value)
        isEditing.value = false
    } catch (error) {
        console.error('Error saving changes:', error)
        isLoading.value = false
    } finally {
        isLoading.value = false
    }
}

const pageSource = ref()
const pageEdit = ref()
const pageTemplate = ref({
    basicInformation: {
        brand: 'Google',
        otherBrand: '',
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
            pageSource.value = docSnap.data()
            if (pageSource.value.info && pageSource.value.info.protection && pageSource.value.info.protection.homeDevices) {
                pageSource.value =  pageSource.value.info.protection.homeDevices
            }
            else {
                pageSource.value = {
                    ...pageTemplate.value
                }
            }
        }
        else {
            pageSource.value = {
                    ...pageTemplate.value
                }
        }
        pageEdit.value = cloneDeep(pageSource.value)
    })
})

const cancelChanges = () => {
    pageEdit.value = cloneDeep(pageSource.value)
    isEditing.value = false            
}
</script>

<template>
    <div v-if="pageSource" class="space-y-4">
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
                    <h2 class="text-lg font-bold">Basic information</h2>
                    <p>Brand</p>
                    <p class="text-gray-500">
                        {{ pageSource.basicInformation.brand }}
                    </p>
                    <p>Smart system</p>
                    <p class="text-gray-500">
                        {{ pageSource.basicInformation.smartSystem }}
                    </p>
                    <p>Centrally monitored</p>
                    <p class="text-gray-500">
                        {{ pageSource.basicInformation.centrallyMonitored }}
                    </p>
                </div>
            </div>
        </article>
        <article class="p-4 bg-white shadow-md rounded-md">
            <div class="space-y-3 relative p-4 rounded-lg hover:bg-gray-50 cursor-pointer" @click="openDetailedEditModal">
                <UButton icon="i-heroicons-pencil" variant="soft" color="gray"
                    class="rounded-full h-8 w-8 absolute top-2 right-2" />
                <div>
                    <h2 class="text-lg font-bold">Detailed information</h2>
                    <p>Number of smart thermostats</p>
                    <p class="text-gray-500">
                        {{ pageSource.detailedInformation.numberOfSmartThermostats }}
                    </p>
                    <p>Number of leak sensors</p>
                    <p class="text-gray-500">
                        {{ pageSource.detailedInformation.numberOfLeakSensors }}
                    </p>
                    <p>Number of other sensors</p>
                    <p class="text-gray-500">
                        {{ pageSource.detailedInformation.numberOfOtherSensors }}
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
    <UModal v-model="isLoading">
        <div class="p-4 flex items-center justify-center">
            <UIcon name="i-heroicons-arrow-path" class="animate-spin" />
            <span class="ml-2">Loading...</span>
        </div>
    </UModal>
    <UModal v-model="isEditing" >
        <div class="flex flex-col h-full">
            <!-- Header -->
            <div class="p-4 border-b">
                <h3 class="text-lg font-bold">Home Devices</h3>
                <h4>{{ editType === 'basic' ? 'Basic' : 'Detailed' }} Information</h4>
            </div>

            <!-- Content (scrollable) -->
            <div v-if="editType === 'basic'" class="flex-1 p-4 overflow-y-auto space-y-4">
                <div class="space-y-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Brand
                    </label>
                    <div class="space-y-3">
                        <div v-for="option in ['Google', 'Ring', 'Notion', 'Mixed', 'Other']" :key="option" :class="[
                            'flex items-center justify-between p-4 rounded-lg border',
                            pageEdit.basicInformation.brand === option ? 'border-blue-500' : 'border-gray-200'
                        ]" @click="pageEdit.basicInformation.brand = option">
                            <span class="text-base">{{ option }}</span>
                            <div :class="[
                                'w-6 h-6 rounded-full border-2 flex items-center justify-center',
                                pageEdit.basicInformation.brand === option ? 'border-blue-500' : 'border-gray-300'
                            ]">
                                <div v-if="pageEdit.basicInformation.brand === option" class="w-3 h-3 rounded-full bg-blue-500" />
                            </div>
                        </div>
                        <div v-if="pageEdit.basicInformation.brand === 'Other'" class="mt-2">
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Other brand
                            </label>
                            <input 
                                type="text" 
                                v-model="pageEdit.basicInformation.otherBrand"
                                class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter brand name"
                            />
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
                            pageEdit.basicInformation.smartSystem === option ? 'border-blue-500' : 'border-gray-200'
                        ]" @click="pageEdit.basicInformation.smartSystem = option">
                            <span class="text-base">{{ option }}</span>
                            <div :class="[
                                'w-6 h-6 rounded-full border-2 flex items-center justify-center',
                                pageEdit.basicInformation.smartSystem === option ? 'border-blue-500' : 'border-gray-300'
                            ]">
                                <div v-if="pageEdit.basicInformation.smartSystem === option" class="w-3 h-3 rounded-full bg-blue-500" />
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
                            pageEdit.basicInformation.centrallyMonitored === option ? 'border-blue-500' : 'border-gray-200'
                        ]" @click="pageEdit.basicInformation.centrallyMonitored = option">
                            <span class="text-base">{{ option }}</span>
                            <div :class="[
                                'w-6 h-6 rounded-full border-2 flex items-center justify-center',
                                pageEdit.basicInformation.centrallyMonitored === option ? 'border-blue-500' : 'border-gray-300'
                            ]">
                                <div v-if="pageEdit.basicInformation.centrallyMonitored === option" class="w-3 h-3 rounded-full bg-blue-500" />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div v-else class="flex-1 p-4 overflow-y-auto space-y-4">
                <div class="space-y-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Number of smart thermostats
                    </label>
                    <input 
                                type="text" 
                                v-model="pageEdit.detailedInformation.numberOfSmartThermostats"
                                class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Number of smart thermostats"
                            />
                </div>
                <div class="space-y-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                            Number of smart thermostats
                    </label>
                    <input 
                                type="text" 
                                v-model="pageEdit.detailedInformation.numberOfLeakSensors"
                                class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Number of smart thermostats"
                            />
                </div>
                <div class="space-y-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                            Number of smart thermostats
                    </label>
                    <input 
                                type="text" 
                                v-model="pageEdit.detailedInformation.numberOfOtherSensors"
                                class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Number of smart thermostats"
                            />
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
