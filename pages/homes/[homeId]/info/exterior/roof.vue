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

const openNotesModal = async () => {
    editType.value = 'notes'
    isEditing.value = true
}

const openAttachmentsModal = async () => {
    editType.value = 'attachments'
    isEditing.value = true
}

const saveChanges = async () => {
    isLoading.value = true
    try {
        const docRef = doc($db, "properties", homeId);
        await updateDoc(docRef, {
            "info.exterior.roof": {
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
const page_title = ref("Roof")
const project_type = ref("roof_inspection")
const pageTemplate = ref({
    basicInformation: {
        squareFeet: '',
        materials: '',
        dateInstalled: '',
    },
    detailedInformation: {
        installer: '',
        price: '',
    },
    notes: '',
    files: [],
});

onMounted(() => {
    const docRef = doc($db, "properties", homeId);
    getDoc(docRef).then((docSnap) => {
        if (docSnap.exists()) {
            const property = docSnap.data()
            if (property.info && property.info.exterior && property.info.exterior.roof) {
                pageSource.value = property.info.exterior.roof
            }
            else {  
                if (property.roof) {
                    pageSource.value = {
                        ...pageTemplate.value
                    }
                    pageSource.value.basicInformation.squareFeet = property.roof.squareFeet
                    pageSource.value.basicInformation.materials = property.roof.materials
                    pageSource.value.basicInformation.dateInstalled = property.roof.dateInstalled
                    pageSource.value.detailedInformation.installer = property.roof.installer
                    pageSource.value.detailedInformation.price = property.roof.price
                    pageSource.value.notes = property.roof.notes
                    pageSource.value.files = property.roof.files
                }
                else {
                    pageSource.value = {
                        ...pageTemplate.value
                    }
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
                    <p class="font-medium">Square feet</p>
                    <p class="text-gray-500">
                        {{ pageSource.basicInformation.squareFeet }}
                    </p>
                    <p class="font-medium">Materials</p>
                    <p class="text-gray-500">
                        {{ pageSource.basicInformation.materials }}
                    </p>
                    <p class="font-medium">Date installed</p>
                    <p class="text-gray-500">
                        {{ pageSource.basicInformation.dateInstalled }}
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
                    <p class="font-medium">Installer</p>
                    <p class="text-gray-500">
                        {{ pageSource.detailedInformation.installer }}
                    </p>
                    <p class="font-medium">Price</p>
                    <p class="text-gray-500">
                        {{ pageSource.detailedInformation.price }}
                    </p>
                </div>
            </div>
        </article>
        <article class="p-4 bg-white shadow-md rounded-md">
            <div class="space-y-3 relative p-4 rounded-lg hover:bg-gray-50 cursor-pointer"
                @click="openNotesModal">
                <UButton icon="i-heroicons-pencil" variant="soft" color="gray"
                    class="rounded-full h-8 w-8 absolute top-2 right-2" />
                <div class="space-y-2">
                    <h2 class="text-lg font-bold">Notes</h2>
                    <p class="text-gray-500">
                        {{ pageSource.notes }}
                    </p>
                </div>
            </div>
        </article>
        <article class="p-4 bg-white shadow-md rounded-md">
            <div class="space-y-3 relative p-4 rounded-lg hover:bg-gray-50 cursor-pointer"
                @click="openAttachmentsModal">
                <UButton icon="i-heroicons-pencil" variant="soft" color="gray"
                    class="rounded-full h-8 w-8 absolute top-2 right-2" />
                <div class="space-y-2">
                  <CommonAttachments ref="attachmentsRef" :attachments="pageSource.files" @fileDeleted="deleteFile" />
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
                    <div class="space-y-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Square feet
                    </label>
                    <input 
                                type="number" 
                                v-model="pageEdit.basicInformation.squareFeet"
                                class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Square feet of roof"
                            />
                </div>
                    <div class="space-y-3">
                        <label class="block text-sm font-bold text-gray-700 mb-2">
                            Roof materials
                        </label>
                        <p class="text-sm text-gray-500">Indicate the type of roof your home has.</p>
                        <div class="space-y-3">
                        <div v-for="option in ['Asphalt', 'Tile', 'Wood', 'Metal', 'Asphalt and Metal', 'Other']" :key="option" :class="[
                            'flex items-center justify-between p-4 rounded-lg border',
                            pageEdit.basicInformation.materials === option ? 'border-blue-500' : 'border-gray-200'
                        ]" @click="pageEdit.basicInformation.materials = option">
                            <span class="text-base">{{ option }}</span>
                            <div :class="[
                                'w-6 h-6 rounded-full border-2 flex items-center justify-center',
                                    pageEdit.basicInformation.materials === option ? 'border-blue-500' : 'border-gray-300'
                            ]">
                                <div v-if="pageEdit.basicInformation.materials === option"
                                    class="w-3 h-3 rounded-full bg-blue-500" />
                            </div>
                            </div>
                        </div>
                    </div>
                    <div class="space-y-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                            Installation date
                    </label>
                    <input 
                                type="date" 
                                v-model="pageEdit.basicInformation.dateInstalled"
                                class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Date roof was installed"
                            />
                    </div>
                </div>
            </div>
            <div v-else-if="editType === 'detailed'" class="flex-1 p-4 overflow-y-auto space-y-4">
                <div class="space-y-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Installer
                    </label>
                    <input 
                                type="text" 
                                v-model="pageEdit.detailedInformation.installer"
                                class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Installer of roof"
                            />
                </div>
                <div class="space-y-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Price
                    </label>
                    <input 
                                type="number" 
                                v-model="pageEdit.detailedInformation.price"
                                class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Price of roof"
                            />
                </div>
            </div>
            <div v-else class="flex-1 p-4 overflow-y-auto space-y-4">
                <div class="space-y-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Notes
                    </label>
                    <input 
                                type="text" 
                                v-model="pageEdit.notes"
                                class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Notes about roof"
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
