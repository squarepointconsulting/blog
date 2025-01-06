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

const saveChanges = async () => {
    isLoading.value = true
    try {
        const docRef = doc($db, "properties", homeId);
        await updateDoc(docRef, {
            "info.basicInformation": {
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
const page_title = ref("Home Info")
const pageTemplate = ref({
    basicInformation: {
        yearBuilt: '',
        propertyType: '',
        squareFeet: '',
        constructionType: '',       
    },
    detailedInformation: {

    },
});

onMounted(() => {
    const docRef = doc($db, "properties", homeId);
    getDoc(docRef).then((docSnap) => {
        if (docSnap.exists()) {
            const property = docSnap.data()
            if (property.info && property.info.basicInformation ) {
                pageSource.value = property.info.basicInformation
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
        <HomeSummary :homeId="homeId" />
        <article class="p-4 bg-white shadow-md rounded-md">
            <div class="space-y-3 relative p-4 rounded-lg hover:bg-gray-50 cursor-pointer" @click="openBasicEditModal">
                <UButton icon="i-heroicons-pencil" variant="soft" color="gray"
                    class="rounded-full h-8 w-8 absolute top-2 right-2" />
                <div class="space-y-2">
                    <h2 class="text-lg font-bold">Basic information</h2>
                    <p class="font-medium">Year Built</p>
                    <p class="text-gray-500">
                        {{ pageSource.basicInformation.yearBuilt }}
                    </p>
                    <p class="font-medium">Property Type</p>
                    <p class="text-gray-500">
                        {{ pageSource.basicInformation.propertyType }}
                    </p>
                    <p class="font-medium">Square Feet</p>
                    <p class="text-gray-500">
                        {{ pageSource.basicInformation.squareFeet }}
                    </p>
                    <p class="font-medium">Construction Type</p>
                    <p class="text-gray-500">
                        {{ pageSource.basicInformation.constructionType }}
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
                    <label class="block text-sm font-bold text-gray-700 mb-2">
                        Year built
                    </label>
                    <select 
                        v-model="pageEdit.basicInformation.yearBuilt"
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
                        Property type
                    </label>
                    <div class="space-y-3">
                        <div v-for="option in ['Residential', 'Condo']" :key="option" :class="[
                            'flex items-center justify-between p-4 rounded-lg border',
                            pageEdit.basicInformation.propertyType === option ? 'border-blue-500' : 'border-gray-200'
                        ]" @click="pageEdit.basicInformation.propertyType = option">
                            <span class="text-base">{{ option }}</span>
                            <div :class="[
                                'w-6 h-6 rounded-full border-2 flex items-center justify-center',
                                    pageEdit.basicInformation.propertyType === option ? 'border-blue-500' : 'border-gray-300'
                            ]">
                                <div v-if="pageEdit.basicInformation.propertyType === option"
                                    class="w-3 h-3 rounded-full bg-blue-500" />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="space-y-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Square feet
                    </label>
                    <input 
                                type="number" 
                                v-model="pageEdit.basicInformation.squareFeet"
                                class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Square feet"
                            />
                            <p class="text-sm text-gray-500">This does not include external structures such as the garage, unless the structures are utilized as living space.</p>
                </div>

                <div class="space-y-4">
                    <label class="block text-sm font-bold text-gray-700 mb-2">
                            Construction type
                    </label>
                    <p class="text-sm text-gray-500">Homes can be built with a variety of construction types. Please select the most appropriate option.</p>

                    <div class="space-y-3">
                        <div v-for="option in ['Frame (most common)', 'Brick veneer', 'Masonry', 'Concrete', 'Steel']" :key="option" :class="[
                            'flex items-center justify-between p-4 rounded-lg border',
                            pageEdit.basicInformation.constructionType === option ? 'border-blue-500' : 'border-gray-200'
                        ]" @click="pageEdit.basicInformation.constructionType = option">
                            <span class="text-base">{{ option }}</span>
                            <div :class="[
                                'w-6 h-6 rounded-full border-2 flex items-center justify-center',
                                    pageEdit.basicInformation.constructionType === option ? 'border-blue-500' : 'border-gray-300'
                            ]">
                                <div v-if="pageEdit.basicInformation.constructionType === option"
                                    class="w-3 h-3 rounded-full bg-blue-500" />
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
