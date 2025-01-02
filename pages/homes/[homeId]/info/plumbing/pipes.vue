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
const isLoadingBasic = ref(false)
const isLoadingDetailed = ref(false)
const isEditingBasic = ref(false)
const isEditingDetailed = ref(false)
const openBasicEditModal = async () => {
    isLoadingBasic.value = true
    try {
        isLoadingBasic.value = false
        isEditingBasic.value = true
    } catch (error) {
        console.error('Error loading data:', error)
        isLoadingBasic.value = false
    }
}

const openDetailedEditModal = async () => {
    isLoadingDetailed.value = true
    try {
        isLoadingDetailed.value = false
        isEditingDetailed.value = true
    } catch (error) {
        console.error('Error loading data:', error)
        isLoadingDetailed.value = false
    }
}

const saveChangesBasic = async () => {
    isLoadingBasic.value = true
    try {
        const docRef = doc($db, "properties", homeId);
        await updateDoc(docRef, {
            info: {
                plumbing: {
                    pipes: {
                        ...pageEdit.value
                    }
                }
            }
        }, { merge: true });
        pageSource.value = cloneDeep(pageEdit.value)
        isEditingBasic.value = false
        isEditingDetailed.value = false
    } catch (error) {
        console.error('Error saving changes:', error)
        isLoadingBasic.value = false
    } finally {
        isLoadingBasic.value = false
    }
}

const saveChangesDetailed = async () => {
    isLoadingDetailed.value = true
    try {
        isLoadingDetailed.value = false
        isEditingDetailed.value = false
    } catch (error) {
        console.error('Error saving changes:', error)
        isLoadingDetailed.value = false
    }
}

const pageSource = ref()
const pageEdit = ref()
const pageTemplate = ref({
    basicInformation: {
        installationYear: 2004,
        materialType: 'PVC',
    },
    detailedInformation: {
        smartWaterMonitor: 'No',
        smartShutoffValve: 'No',
    },
});

onMounted(() => {
    const docRef = doc($db, "properties", homeId);
    getDoc(docRef).then((docSnap) => {
        if (docSnap.exists()) {
            pageSource.value = docSnap.data()
            if (pageSource.value.info && pageSource.value.info.plumbing && pageSource.value.info.plumbing.pipes) {
                pageSource.value =  pageSource.value.info.plumbing.pipes
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

const cancelChangesBasic = () => {
    pageEdit.value = cloneDeep(pageSource.value)
    isEditingBasic.value = false            
}

const cancelChangesDetailed = () => {
    pageEdit.value = cloneDeep(pageSource.value)
    isEditingDetailed.value = false
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
                    <p>Installation year</p>
                    <p class="text-gray-500">
                        {{ pageSource.basicInformation.installationYear }}
                    </p>
                    <p>Material type</p>
                    <p class="text-gray-500">
                        {{ pageSource.basicInformation.materialType }}
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
                    <p>Smart water monitor</p>
                    <p class="text-gray-500">
                        {{ pageSource.detailedInformation.smartWaterMonitor }}
                    </p>
                    <p>Smart shutoff valve</p>
                    <p class="text-gray-500">
                        {{ pageSource.detailedInformation.smartShutoffValve }}
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

    <UModal v-model="isEditingBasic" >
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
                        Installation year
                    </label>
                    <input 
                                type="text" 
                                v-model="pageEdit.basicInformation.installationYear"
                                class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Installation year"
                            />
                </div>

                <div class="space-y-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Material type
                    </label>
                    <div class="space-y-3">
                        <div v-for="option in ['Brass', 'Copper', 'CPVC', 'Iron', 'PEX', 'PVC', 'Steel', 'Mixed']" :key="option" :class="[
                            'flex items-center justify-between p-4 rounded-lg border',
                            pageEdit.basicInformation.materialType === option ? 'border-blue-500' : 'border-gray-200'
                        ]" @click="pageEdit.basicInformation.materialType = option">
                            <span class="text-base">{{ option }}</span>
                            <div :class="[
                                'w-6 h-6 rounded-full border-2 flex items-center justify-center',
                                pageEdit.basicInformation.materialType === option ? 'border-blue-500' : 'border-gray-300'
                            ]">
                                <div v-if="pageEdit.basicInformation.materialType === option" class="w-3 h-3 rounded-full bg-blue-500" />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div class="p-4 border-t mt-auto">
                <div class="flex justify-end gap-2">
                    <UButton color="gray" variant="soft" label="Cancel" @click="cancelChangesBasic" />
                    <UButton color="blue" label="Save" @click="saveChangesBasic" />
                </div>
            </div>
        </div>
    </UModal>

    <UModal v-model="isEditingDetailed" >
        <div class="flex flex-col h-full">
            <!-- Header -->
            <div class="p-4 border-b">
                <h3 class="text-lg font-bold">Pipes</h3>
                <h4>Detailed information</h4>
            </div>

            <!-- Content (scrollable) -->
            <div class="flex-1 p-4 overflow-y-auto space-y-4">
                <div class="space-y-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Smart water monitor
                    </label>
                    <div class="space-y-3">
                        <div v-for="option in ['Yes', 'No']" :key="option" :class="[
                            'flex items-center justify-between p-4 rounded-lg border',
                            pageEdit.detailedInformation.smartWaterMonitor === option ? 'border-blue-500' : 'border-gray-200'
                        ]" @click="pageEdit.detailedInformation.smartWaterMonitor = option">
                            <span class="text-base">{{ option }}</span>
                            <div :class="[
                                'w-6 h-6 rounded-full border-2 flex items-center justify-center',
                                pageEdit.detailedInformation.smartWaterMonitor === option ? 'border-blue-500' : 'border-gray-300'
                            ]">
                                <div v-if="pageEdit.detailedInformation.smartWaterMonitor === option" class="w-3 h-3 rounded-full bg-blue-500" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="space-y-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Smart shutoff valve
                    </label>
                    <div class="space-y-3">
                        <div v-for="option in ['Yes', 'No']" :key="option" :class="[
                            'flex items-center justify-between p-4 rounded-lg border',
                            pageEdit.detailedInformation.smartShutoffValve === option ? 'border-blue-500' : 'border-gray-200'
                        ]" @click="pageEdit.detailedInformation.smartShutoffValve  = option">
                            <span class="text-base">{{ option }}</span>
                            <div :class="[
                                'w-6 h-6 rounded-full border-2 flex items-center justify-center',
                                pageEdit.detailedInformation.smartShutoffValve === option ? 'border-blue-500' : 'border-gray-300'
                            ]">
                                <div v-if="pageEdit.detailedInformation.smartShutoffValve === option" class="w-3 h-3 rounded-full bg-blue-500" />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div class="p-4 border-t mt-auto">
                <div class="flex justify-end gap-2">
                    <UButton color="gray" variant="soft" label="Cancel" @click="cancelChangesDetailed" />
                    <UButton color="blue" label="Save" @click="saveChangesDetailed" />
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
