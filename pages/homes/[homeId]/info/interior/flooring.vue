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
            "info.interior.flooring": {
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
const page_title = ref("Flooring")
const project_type = ref("flooring_inspection")
const pageTemplate = ref({
    basicInformation: {
        hasCarpet: '',
        hasHardwood: '',
        hasTile: '',
    },
    detailedInformation: {
        carpetInstallationYear: '',
        carpetLastCleaned: '',
        tileInstallationYear: '',
        hardwoodInstallationYear: '',
        hardwoodLastRefinished: '',
        hardwoodLastRefinished: '',
    },
});

onMounted(() => {
    const docRef = doc($db, "properties", homeId);
    getDoc(docRef).then((docSnap) => {
        if (docSnap.exists()) {
            const property = docSnap.data()
            if (property.info && property.info.interior && property.info.interior.flooring) {
                pageSource.value = property.info.interior.flooring
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
                    <p class="font-medium">Has carpet</p>
                    <p class="text-gray-500">
                        {{ pageSource.basicInformation.hasCarpet }}
                    </p>
                    <p class="font-medium">Has hardwood</p>
                    <p class="text-gray-500">
                        {{ pageSource.basicInformation.hasHardwood }}
                    </p>
                    <p class="font-medium">Has tile</p>
                    <p class="text-gray-500">
                        {{ pageSource.basicInformation.hasTile }}
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
                    <p class="font-medium">Carpet installation year</p>
                    <p class="text-gray-500">
                        {{ pageSource.detailedInformation.carpetInstallationYear }}
                    </p>
                    <p class="font-medium">Carpet last cleaned</p>
                    <p class="text-gray-500">
                        {{ pageSource.detailedInformation.carpetLastCleaned }}
                    </p>
                    <p class="font-medium">Tile installation year</p>
                    <p class="text-gray-500">
                        {{ pageSource.detailedInformation.tileInstallationYear }}
                    </p>
                    <p class="font-medium">Hardwood installation year</p>
                    <p class="text-gray-500">
                        {{ pageSource.detailedInformation.hardwoodInstallationYear }}
                    </p>
                    <p class="font-medium">Hardwood last refinished</p>
                    <p class="text-gray-500">
                        {{ pageSource.detailedInformation.hardwoodLastRefinished }}
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
                        Has carpet
                    </label>
                    <div class="space-y-3">
                        <div v-for="option in ['Yes', 'No']" :key="option" :class="[
                                'flex items-center justify-between p-4 rounded-lg border',
                                pageEdit.basicInformation.hasCarpet === option ? 'border-blue-500' : 'border-gray-200'
                            ]" @click="pageEdit.basicInformation.hasCarpet = option">
                            <span class="text-base">{{ option }}</span>
                            <div :class="[
                                'w-6 h-6 rounded-full border-2 flex items-center justify-center',
                                pageEdit.basicInformation.hasCarpet === option ? 'border-blue-500' : 'border-gray-300'
                            ]">
                                <div v-if="pageEdit.basicInformation.hasCarpet === option"
                                    class="w-3 h-3 rounded-full bg-blue-500" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="space-y-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Has hardwood
                    </label>
                    <div class="space-y-3">
                        <div v-for="option in ['Yes', 'No']" :key="option" :class="[
                                'flex items-center justify-between p-4 rounded-lg border',
                                pageEdit.basicInformation.hasHardwood === option ? 'border-blue-500' : 'border-gray-200'
                                ]" @click="pageEdit.basicInformation.hasHardwood = option">
                            <span class="text-base">{{ option }}</span>
                            <div :class="[
                                'w-6 h-6 rounded-full border-2 flex items-center justify-center',
                                pageEdit.basicInformation.hasHardwood === option ? 'border-blue-500' : 'border-gray-300'
                            ]">
                                <div v-if="pageEdit.basicInformation.hasHardwood === option"
                                    class="w-3 h-3 rounded-full bg-blue-500" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="space-y-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Has tile
                    </label>
                    <div class="space-y-3">
                            <div v-for="option in ['Yes', 'No']" :key="option" :class="[
                                'flex items-center justify-between p-4 rounded-lg border',
                                pageEdit.basicInformation.hasTile === option ? 'border-blue-500' : 'border-gray-200'
                            ]" @click="pageEdit.basicInformation.hasTile = option">
                            <span class="text-base">{{ option }}</span>
                            <div :class="[
                                'w-6 h-6 rounded-full border-2 flex items-center justify-center',
                                pageEdit.basicInformation.hasTile === option ? 'border-blue-500' : 'border-gray-300'
                            ]">
                                <div v-if="pageEdit.basicInformation.hasTile === option"
                                    class="w-3 h-3 rounded-full bg-blue-500" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="flex-1 p-4 overflow-y-auto space-y-4">
                <div class="space-y-4">
                    <label class="block text-sm font-bold text-gray-700 mb-2">
                        Carpet installation year
                    </label>
                    <select 
                        v-model="pageEdit.detailedInformation.carpetInstallationYear"
                        class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select year</option>
                        <option 
                            v-for="year in Array.from({length: 100}, (_, i) => new Date().getFullYear() - i)" 
                            :key="year" 
                            :value="year"
                        >
                            {{ year }}
                        </option>
                    </select>
                </div>
                <div class="space-y-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Carpet last cleaned
                    </label>
                    <input 
                                type="date" 
                                v-model="pageEdit.detailedInformation.carpetLastCleaned"
                                class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Date carpet was last cleaned"
                            />
                </div>
                <div class="space-y-4">
                    <label class="block text-sm font-bold text-gray-700 mb-2">
                        Tile installation year
                    </label>
                    <select 
                        v-model="pageEdit.detailedInformation.tileInstallationYear"
                        class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select year</option>
                        <option 
                            v-for="year in Array.from({length: 100}, (_, i) => new Date().getFullYear() - i)" 
                            :key="year" 
                            :value="year"
                        >
                            {{ year }}
                        </option>
                    </select>
                </div>
                <div class="space-y-4">
                    <label class="block text-sm font-bold text-gray-700 mb-2">
                        Hardwood installation year
                    </label>
                    <select 
                        v-model="pageEdit.detailedInformation.hardwoodInstallationYear"
                        class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select year</option>
                        <option 
                            v-for="year in Array.from({length: 100}, (_, i) => new Date().getFullYear() - i)" 
                            :key="year" 
                            :value="year"
                        >
                            {{ year }}
                        </option>
                    </select>
                </div>
                <div class="space-y-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Hardwood last refinished
                    </label>
                    <input 
                                type="date" 
                                v-model="pageEdit.detailedInformation.hardwoodLastRefinished"
                                class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Date hardwood was last refinished"
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
