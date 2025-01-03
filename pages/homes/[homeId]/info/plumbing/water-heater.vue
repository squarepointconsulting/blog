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
const isEditing = ref(false)
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
            "info.plumbing.waterHeater": {
                ...pageEdit.value
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
const page_title = ref("Water Heater")
const project_type = ref("water_heater_inspection")
const pageTemplate = ref({
    basicInformation: {
        installationYear: '',
        systemType: '',
        isInsulated: '',
        location: '',
    },
    detailedInformation: {
        hasTank: '',
        hasDripPan: '',
        supplyLineType: '',
        lastFlushed: '',
        brand: '',
        model: '',
    },
});

onMounted(() => {
    const docRef = doc($db, "properties", homeId);
    getDoc(docRef).then((docSnap) => {
        if (docSnap.exists()) {
            const property = docSnap.data()
            if (property.info && property.info.plumbing && property.info.plumbing.waterHeater) {
                pageSource.value = property.info.plumbing.waterHeater
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
                {{ page_title }}
            </h2>
        </article>
        <article class="p-4 bg-white shadow-md rounded-md">
            <div class="space-y-3 relative p-4 rounded-lg hover:bg-gray-50 cursor-pointer" @click="openBasicEditModal">
                <UButton icon="i-heroicons-pencil" variant="soft" color="gray"
                    class="rounded-full h-8 w-8 absolute top-2 right-2" />
                <div class="space-y-2">
                    <h2 class="text-lg font-bold">Basic information</h2>
                    <p class="font-medium">Installation year</p>
                    <p class="text-gray-500">
                        {{ pageSource.basicInformation.installationYear }}
                    </p>
                    <p class="font-medium">System type</p>
                    <p class="text-gray-500">
                        {{ pageSource.basicInformation.systemType }}
                    </p>
                    <p class="font-medium">Is insulated</p>
                    <p class="text-gray-500">
                        {{ pageSource.basicInformation.isInsulated }}
                    </p>
                    <p class="font-medium">Location</p>
                    <p class="text-gray-500">
                        {{ pageSource.basicInformation.location }}
                    </p>
                </div>
            </div>
        </article>
        <article class="p-4 bg-white shadow-md rounded-md">
            <div class="space-y-3 relative p-4 rounded-lg hover:bg-gray-50 cursor-pointer"
                @click="openDetailedEditModal">
                <UButton icon="i-heroicons-pencil" variant="soft" color="gray"
                    class="rounded-full h-8 w-8 absolute top-2 right-2" />
                <div class="space-y-2">
                    <h2 class="text-lg font-bold">Detailed information</h2>
                    <p class="font-medium">Has tank</p>
                    <p class="text-gray-500">
                        {{ pageSource.detailedInformation.hasTank }}
                    </p>
                    <p class="font-medium">Has drip pan</p>
                    <p class="text-gray-500">
                        {{ pageSource.detailedInformation.hasDripPan }}
                    </p>
                    <p class="font-medium">Supply line type</p>
                    <p class="text-gray-500">
                        {{ pageSource.detailedInformation.supplyLineType }}
                    </p>
                    <p class="font-medium">Last flushed</p>
                    <p class="text-gray-500">
                        {{ pageSource.detailedInformation.lastFlushed }}
                    </p>
                    <p class="font-medium">Brand</p>
                    <p class="text-gray-500">
                        {{ pageSource.detailedInformation.brand }}
                    </p>
                    <p class="font-medium">Model</p>
                    <p class="text-gray-500">
                        {{ pageSource.detailedInformation.model }}
                    </p>
                </div>
            </div>
        </article>
        <ProjectRecord :homeId="homeId" :projectType="project_type" recordType="inspection_record" />
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
    <UModal v-model="isEditing">
        <div class="flex flex-col h-full">
            <div class="p-4 border-b">
                <h3 class="text-lg font-bold">Home Devices</h3>
                <h4>{{ editType === 'basic' ? 'Basic' : 'Detailed' }} Information</h4>
            </div>
            <div v-if="editType === 'basic'" class="flex-1 p-4 overflow-y-auto space-y-4">
                <div class="space-y-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Year of installation
                    </label>
                    <input type="text" v-model="pageEdit.basicInformation.installationYear"
                        class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Year of installation" />
                </div>
                <div class="space-y-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        System type
                    </label>
                    <div class="space-y-3">
                        <div v-for="option in ['Gas', 'Electric']" :key="option"
                            :class="[
                                'flex items-center justify-between p-4 rounded-lg border',
                                pageEdit.basicInformation.systemType === option ? 'border-blue-500' : 'border-gray-200'
                            ]" @click="pageEdit.basicInformation.systemType = option">
                            <span class="text-base">{{ option }}</span>
                            <div :class="[
                                'w-6 h-6 rounded-full border-2 flex items-center justify-center',
                                pageEdit.basicInformation.systemType === option ? 'border-blue-500' : 'border-gray-300'
                            ]">
                                <div v-if="pageEdit.basicInformation.systemType === option"
                                    class="w-3 h-3 rounded-full bg-blue-500" />
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="space-y-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Insulated    
                    </label>
                    <p class="text-sm text-gray-500">Indicate whether your water heater is insulated.</p>
                    <div class="space-y-3">
                        <div v-for="option in ['Yes', 'No']" :key="option" :class="[
                            'flex items-center justify-between p-4 rounded-lg border',
                            pageEdit.basicInformation.isInsulated === option ? 'border-blue-500' : 'border-gray-200'
                        ]" @click="pageEdit.basicInformation.isInsulated = option">
                            <span class="text-base">{{ option }}</span>
                            <div :class="[
                                'w-6 h-6 rounded-full border-2 flex items-center justify-center',
                                pageEdit.basicInformation.isInsulated === option ? 'border-blue-500' : 'border-gray-300'
                            ]">
                                <div v-if="pageEdit.basicInformation.isInsulated === option"
                                    class="w-3 h-3 rounded-full bg-blue-500" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="space-y-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Location
                    </label>
                    <div class="space-y-3">
                        <div v-for="option in ['Garage', 'Basement', 'Exterior', 'First Floor', 'Second Floor', 'Attic', 'Roof', 'Other']" :key="option" :class="[
                            'flex items-center justify-between p-4 rounded-lg border',
                            pageEdit.basicInformation.location === option ? 'border-blue-500' : 'border-gray-200'
                        ]" @click="pageEdit.basicInformation.location = option">
                            <span class="text-base">{{ option }}</span>
                            <div :class="[
                                'w-6 h-6 rounded-full border-2 flex items-center justify-center',
                                pageEdit.basicInformation.location === option ? 'border-blue-500' : 'border-gray-300'
                            ]">
                                <div v-if="pageEdit.basicInformation.location === option" class="w-3 h-3 rounded-full bg-blue-500" />
                            </div>
                        </div>
                        <div v-if="pageEdit.basicInformation.location === 'Other'" class="mt-2">
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Other location
                            </label>
                            <input 
                                type="text" 
                                v-model="pageEdit.basicInformation.otherLocation"
                                class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter location name"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="flex-1 p-4 overflow-y-auto space-y-4">
                <div class="space-y-4">
                    <label class="block text-sm font-bold text-gray-700 mb-2">
                        Has tank
                    </label>
                    <p class="text-sm text-gray-500">Indicate whether the water heater has a tank.</p>

                    <div class="space-y-3">
                        <div v-for="option in ['Yes', 'No']" :key="option" :class="[
                            'flex items-center justify-between p-4 rounded-lg border',
                            pageEdit.detailedInformation.hasTank === option ? 'border-blue-500' : 'border-gray-200'
                        ]" @click="pageEdit.detailedInformation.hasTank = option">
                            <span class="text-base">{{ option }}</span>
                            <div :class="[
                                'w-6 h-6 rounded-full border-2 flex items-center justify-center',
                                pageEdit.detailedInformation.hasTank === option ? 'border-blue-500' : 'border-gray-300'
                            ]">
                                <div v-if="pageEdit.detailedInformation.hasTank === option"
                                    class="w-3 h-3 rounded-full bg-blue-500" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="space-y-4">
                    <label class="block text-sm font-bold text-gray-700 mb-2">
                        Has drip pan
                    </label>
                    <p class="text-sm text-gray-500">Indicate whether the water heater has a drip pan.</p>

                    <div class="space-y-3">
                        <div v-for="option in ['Yes', 'No']" :key="option" :class="[
                            'flex items-center justify-between p-4 rounded-lg border',
                            pageEdit.detailedInformation.hasDripPan === option ? 'border-blue-500' : 'border-gray-200'
                        ]" @click="pageEdit.detailedInformation.hasDripPan = option">
                            <span class="text-base">{{ option }}</span>
                            <div :class="[
                                'w-6 h-6 rounded-full border-2 flex items-center justify-center',
                                pageEdit.detailedInformation.hasDripPan === option ? 'border-blue-500' : 'border-gray-300'
                            ]">
                                <div v-if="pageEdit.detailedInformation.hasDripPan === option"
                                    class="w-3 h-3 rounded-full bg-blue-500" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="space-y-4">
                    <label class="block text-sm font-bold text-gray-700 mb-2">
                        Supply line type
                    </label>
                    <p class="text-sm text-gray-500">Indicate the type of supply line.</p>

                    <div class="space-y-3">
                        <div v-for="option in ['Braided Metal', 'Rubber']" :key="option" :class="[
                            'flex items-center justify-between p-4 rounded-lg border',
                            pageEdit.detailedInformation.supplyLineType === option ? 'border-blue-500' : 'border-gray-200'
                        ]" @click="pageEdit.detailedInformation.supplyLineType = option">
                            <span class="text-base">{{ option }}</span>
                            <div :class="[
                                'w-6 h-6 rounded-full border-2 flex items-center justify-center',
                                pageEdit.detailedInformation.supplyLineType === option ? 'border-blue-500' : 'border-gray-300'
                            ]">
                                <div v-if="pageEdit.detailedInformation.supplyLineType === option"
                                    class="w-3 h-3 rounded-full bg-blue-500" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="space-y-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Last flushed
                    </label>
                        <input type="text" v-model="pageEdit.detailedInformation.lastFlushed"
                        class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter last flushed date" />
                </div>
                <div class="space-y-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Brand
                    </label>
                    <div class="space-y-3">
                        <div v-for="option in ['Rheem', 'Rinnai', 'A. O. Smith', 'Bradford White', 'Stiebel Eltron', 'Eco Smart', 'Bosch', 'Tagaki', 'Other']" :key="option" :class="[
                            'flex items-center justify-between p-4 rounded-lg border',
                            pageEdit.detailedInformation.brand === option ? 'border-blue-500' : 'border-gray-200'
                        ]" @click="pageEdit.detailedInformation.brand = option">
                            <span class="text-base">{{ option }}</span>
                            <div :class="[
                                'w-6 h-6 rounded-full border-2 flex items-center justify-center',
                                    pageEdit.detailedInformation.brand === option ? 'border-blue-500' : 'border-gray-300'
                            ]">
                                <div v-if="pageEdit.detailedInformation.brand === option" class="w-3 h-3 rounded-full bg-blue-500" />
                            </div>
                        </div>
                        <div v-if="pageEdit.detailedInformation.brand === 'Other'" class="mt-2">
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Other brand
                            </label>
                            <input 
                                type="text" 
                                v-model="pageEdit.detailedInformation.otherBrand"
                                class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter brand"
                            />
                        </div>
                    </div>
                </div>
                <div class="space-y-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Model
                    </label>
                        <input type="text" v-model="pageEdit.detailedInformation.model"
                        class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter model" />
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
