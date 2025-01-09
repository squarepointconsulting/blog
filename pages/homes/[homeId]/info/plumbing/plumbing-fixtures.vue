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
            "info.plumbing.fixtures": {
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
const page_title = ref("Plumbing Fixtures")
const project_type = ref("plumbing_fixtures_inspection")
const pageTemplate = ref({
    basicInformation: {
        numberOfToilets: '',
        numberOfSinks: '',
        numberOfBathtubs: '',
        numberOfShowers: '',
    },
    detailedInformation: {

    },
});

onMounted(() => {
    const docRef = doc($db, "properties", homeId);
    getDoc(docRef).then((docSnap) => {
        if (docSnap.exists()) {
            const property = docSnap.data()
            if (property.info && property.info.plumbing && property.info.plumbing.fixtures) {
                pageSource.value = property.info.plumbing.fixtures
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
                    <p class="font-medium">Number of toilets</p>
                    <p class="text-gray-500">
                        {{ pageSource.basicInformation.numberOfToilets }}
                    </p>
                    <p class="font-medium">Number of sinks</p>
                    <p class="text-gray-500">
                        {{ pageSource.basicInformation.numberOfSinks }}
                    </p>
                    <p class="font-medium">Number of bathtubs</p>
                    <p class="text-gray-500">
                        {{ pageSource.basicInformation.numberOfBathtubs }}
                    </p>
                    <p class="font-medium">Number of showers</p>
                    <p class="text-gray-500">
                        {{ pageSource.basicInformation.numberOfShowers }}
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
                <h3 class="text-lg font-bold">{{ page_title }}</h3>
                <h4>{{ editType === 'basic' ? 'Basic' : 'Detailed' }} Information</h4>
            </div>
            <div v-if="editType === 'basic'" class="flex-1 p-4 overflow-y-auto space-y-4">
                <div class="space-y-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Number of toilets
                    </label>
                    <div class="space-y-3">
                        <div v-for="option in ['1', '2', '3', 'More']" :key="option" :class="[
                            'flex items-center justify-between p-4 rounded-lg border',
                            pageEdit.basicInformation.numberOfToilets === option ? 'border-blue-500' : 'border-gray-200'
                        ]" @click="pageEdit.basicInformation.numberOfToilets = option">
                            <span class="text-base">{{ option }}</span>
                            <div :class="[
                                'w-6 h-6 rounded-full border-2 flex items-center justify-center',
                                pageEdit.basicInformation.numberOfToilets === option ? 'border-blue-500' : 'border-gray-300'
                            ]">
                                <div v-if="pageEdit.basicInformation.numberOfToilets === option" class="w-3 h-3 rounded-full bg-blue-500" />
                            </div>
                        </div>
                        <div v-if="!['1', '2', '3'].includes(pageEdit.basicInformation.numberOfToilets)" class="mt-2">
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Enter the value manually
                            </label>
                            <input 
                                type="text" 
                                v-model="pageEdit.basicInformation.numberOfToiletsOther"
                                class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter number of toilets"
                            />
                        </div>
                    </div>
                </div>
                <div class="space-y-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                            Number of toilets
                    </label>
                    <div class="space-y-3">
                        <div v-for="option in ['1', '2', '3', 'More']" :key="option" :class="[
                            'flex items-center justify-between p-4 rounded-lg border',
                            pageEdit.basicInformation.numberOfSinks === option ? 'border-blue-500' : 'border-gray-200'
                        ]" @click="pageEdit.basicInformation.numberOfSinks = option">
                            <span class="text-base">{{ option }}</span>
                            <div :class="[
                                'w-6 h-6 rounded-full border-2 flex items-center justify-center',
                                pageEdit.basicInformation.numberOfSinks === option ? 'border-blue-500' : 'border-gray-300'
                            ]">
                                <div v-if="pageEdit.basicInformation.numberOfSinks === option" class="w-3 h-3 rounded-full bg-blue-500" />
                            </div>
                        </div>
                        <div v-if="!['1', '2', '3'].includes(pageEdit.basicInformation.numberOfSinks)" class="mt-2">
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Enter the value manually
                            </label>
                            <input 
                                type="text" 
                                v-model="pageEdit.basicInformation.numberOfSinksOther"
                                class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter number of sinks"
                            />
                        </div>
                    </div>
                </div>
                <div class="space-y-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Number of bathtubs
                    </label>
                    <div class="space-y-3">
                        <div v-for="option in ['1', '2', '3', 'More']" :key="option" :class="[
                            'flex items-center justify-between p-4 rounded-lg border',
                            pageEdit.basicInformation.numberOfBathtubs === option ? 'border-blue-500' : 'border-gray-200'
                        ]" @click="pageEdit.basicInformation.numberOfBathtubs = option">
                            <span class="text-base">{{ option }}</span>
                            <div :class="[
                                'w-6 h-6 rounded-full border-2 flex items-center justify-center',
                                pageEdit.basicInformation.numberOfToilets === option ? 'border-blue-500' : 'border-gray-300'
                            ]">
                                <div v-if="pageEdit.basicInformation.numberOfBathtubs === option" class="w-3 h-3 rounded-full bg-blue-500" />
                            </div>
                        </div>
                        <div v-if="!['1', '2', '3'].includes(pageEdit.basicInformation.numberOfBathtubs)" class="mt-2">
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Enter the value manually
                            </label>
                            <input 
                                type="text" 
                                v-model="pageEdit.basicInformation.numberOfBathtubsOther"
                                class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter number of bathtubs"
                            />
                        </div>
                    </div>
                </div>
                <div class="space-y-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Number of showers
                    </label>
                    <div class="space-y-3">
                        <div v-for="option in ['1', '2', '3', 'More']" :key="option" :class="[
                            'flex items-center justify-between p-4 rounded-lg border',
                            pageEdit.basicInformation.numberOfShowers === option ? 'border-blue-500' : 'border-gray-200'
                        ]" @click="pageEdit.basicInformation.numberOfShowers = option">
                            <span class="text-base">{{ option }}</span>
                            <div :class="[
                                'w-6 h-6 rounded-full border-2 flex items-center justify-center',
                                pageEdit.basicInformation.numberOfToilets === option ? 'border-blue-500' : 'border-gray-300'
                            ]">
                                <div v-if="pageEdit.basicInformation.numberOfShowers === option" class="w-3 h-3 rounded-full bg-blue-500" />
                            </div>
                        </div>
                        <div v-if="!['1', '2', '3'].includes(pageEdit.basicInformation.numberOfShowers)" class="mt-2">
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Enter the value manually
                            </label>
                            <input 
                                type="text" 
                                v-model="pageEdit.basicInformation.numberOfShowersOther"
                                class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter number of showers"
                            />
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
