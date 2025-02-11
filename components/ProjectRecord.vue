<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf';
import { collection, addDoc, query, orderBy, where, getDoc, doc, updateDoc, deleteDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
const { $db, $storage } = useNuxtApp();

const home = ref()
const props = defineProps({
  homeId: {
    type: String,
    required: true,
  },
  projectType: {
    type: String,
    required: true,
  },
  recordType: {
    type: String,
    required: false,
    default: 'project_record',
  },

});

onMounted(() => {
    const docRef = doc($db, "properties", props.homeId);
    getDoc(docRef).then ((docSnap) => {
        if (docSnap.exists()) {
            home.value = docSnap.data()
        } else {
            console.error("No such document!");
        }
    })    
})

const user = await useCurrentUser()
const updated_at_timestamp = serverTimestamp()
const projectRecord = ref({
        type: props.projectType,
        timestamp: updated_at_timestamp,
        completedByUserUid: user.value.uid,
        completedByUserDisplayName: user.value.displayName,
        attachments: [],
    });


const tasksRef = collection($db, 'properties', props.homeId, 'project_records');
const tasksQuery = query(
  tasksRef,
  where('type', '==', props.projectType), 
  orderBy('timestamp', 'desc') 
);
const tasks = useCollection(tasksQuery);

const columns = [
    {
        key: 'type',
        label: 'Type',
    },
    { label: 'Date', key: 'timestamp' },
    {
        key: 'completedByUserDisplayName',
        label: 'User',
    },
]

function snakeToNormalText(snakeStr) {
    return snakeStr
        .split('_')                // Split the string by underscores
        .map(word =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()  // Capitalize the first letter of each word
        )
        .join(' ');                // Join the words back with spaces
}

const isOpen = ref(false)
const uploadedFiles = ref([]);
const fileInput = ref(null);
const isAccepted = ref(false);
const inspectionCondition = ref('');
const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (file.type.startsWith('application/pdf')) {
                generatePdfThumbnail(file).then((thumbnail) => {
                    thumbnailBlob.value = thumbnail;
                    localThumbnailUrl.value = URL.createObjectURL(thumbnailBlob.value);
                    uploadedFiles.value.push({
                        name: file.name,
                        preview: localThumbnailUrl.value,
                        type: file.type,
                        file: file,
                        preview_file: thumbnail,
                    });
                });
            } else {
                uploadedFiles.value.push({
                    name: file.name,
                    preview: reader.result,
                    type: file.type,
                    file: file,
                    preview_file: null,
                });
            }
        };
        reader.readAsDataURL(file);
    });
};

const isImage = (file) => file.type.startsWith('image/');
const isVideo = (file) => file.type.startsWith('video/');
const isUploading = ref(false);
const localThumbnailUrl = ref(null);
const thumbnailBlob = ref(null);

async function generatePdfThumbnail(file) {
    const pdf = await getDocument(await file.arrayBuffer()).promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 1 });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const context = canvas.getContext('2d');
    await page.render({ canvasContext: context, viewport }).promise;
    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            resolve(blob);
        }, 'image/png');
    });
}

const submitForm = async () => {
    if (!isAccepted.value) {
        isOpen.value = false;
        return;
    }
    isUploading.value = true;
    const docRef = await addDoc(collection($db, "properties", props.homeId, "project_records"), projectRecord.value);

    try {
        isAccepted.value = false;
        // Create an array of promises for file uploads
        const uploadPromises = uploadedFiles.value.map(async (file) => {
            const fileRef = storageRef($storage, `properties/${props.homeId}/project_records/${docRef.id}/${file.name}`);
            const snapshot = await uploadBytes(fileRef, file.file);
            const url = await getDownloadURL(fileRef);
            if (file.type.startsWith('application/pdf')) {
                const thumbnailRef = storageRef($storage, `properties/${props.homeId}/project_records/${docRef.id}/${file.name}-thumbnail.png`);
                const thumbnailSnapshot = await uploadBytes(thumbnailRef, file.preview_file);
                const thumbnailUrl = await getDownloadURL(thumbnailRef);
                return {
                    name: file.name,
                    url: url,
                    type: file.type,
                    preview: thumbnailUrl,
                };
            }
            else {
                return {
                    name: file.name,
                    url: url,
                    type: file.type,
                    preview: url,
                };
            }
        });

        // Wait for all file uploads to complete
        const uploadedFileData = await Promise.all(uploadPromises);
        projectRecord.value.attachments = [...projectRecord.value.attachments, ...uploadedFileData];
        projectRecord.value.inspectionCondition = inspectionCondition
        await setDoc(docRef, {...projectRecord.value}, { merge: true });

        // Check for any quests that are completed by this project record
        // const questRef = collection($db, "properties", props.homeId, "quests");
        // const questQuery = query(questRef, where('type', '==', 'project_record'), where('completedByUserUid', '==', user.value.uid));
        // const quest = await getDocs(questQuery);
        // console.log(quest);

    } catch (error) {
        console.error('Error in submitForm:', error);
    } finally {
        uploadedFiles.value = [];
        isUploading.value = false;

        // Clear the file input
        if (fileInput.value) {
            fileInput.value.value = '';
        }
        //router.push({ name: 'homes-homeId', params: { homeId: props.homeId } })
        isOpen.value = false;
    }
};

const setInspectionCondition = (option) => {
    inspectionCondition.value = option;
    isAccepted.value = true
}
</script>

<template>
    <article class="p-4 bg-white shadow-md rounded-md">
        <section>
            <div class="md:col-span-2 mt-4">
                <button @click="isOpen = true" type="submit" class="bg-blue-500 text-white rounded p-2 w-full">
                     {{ recordType === 'project_record' ? 'Log Project' : 'Complete Inspection' }}
                </button>
            </div>
        </section>
        <div v-if="tasks.length > 0" class="space-y-3">
            <UTable :rows="tasks" :columns="columns">
                <template #timestamp-data="{ row }">
                    {{ row.timestamp.toDate().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true,
                    }) }}
                </template>
                <template #type-data="{ row }">
                    <NuxtLink :to="{ name: 'homes-homeId-projects-projectId', params: {homeId: props.homeId, projectId: row.id }}"
                        class="text-blue-600 hover:text-blue-800 hover:underline">
                        {{ snakeToNormalText(row.type) }}
                    </NuxtLink>
                </template>
            </UTable>
        </div>
    </article>
    <UModal v-model="isOpen">
        <form @submit.prevent="submitForm" class="max-w-4xl mx-auto px-4">
            <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
                <template #header>
                    <article v-if="recordType === 'project_record'">
                        <div>
                            <UCheckbox v-model="isAccepted" label="Complete"
                                help="I certify I have completed the task according to the instructions provided.">
                            </UCheckbox>
                        </div>
                    </article>
                    <article v-else>
                        <div class="space-y-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Inspection condition
                    </label>
                    <div class="space-y-3">
                        <div v-for="option in ['Excellent - like new', 'Good - no issues', 'Fair - minor wear and tear', 'Poor - major issues', 'Very Poor - not functional']" :key="option"
                            :class="[
                                'flex items-center justify-between p-4 rounded-lg border',
                                inspectionCondition === option ? 'border-blue-500' : 'border-gray-200'
                            ]" @click="setInspectionCondition(option)">
                            <span class="text-base">{{ option }}</span>
                            <div :class="[
                                'w-6 h-6 rounded-full border-2 flex items-center justify-center',
                                inspectionCondition === option ? 'border-blue-500' : 'border-gray-300'
                            ]">
                                <div v-if="inspectionCondition === option"
                                    class="w-3 h-3 rounded-full bg-blue-500" />
                            </div>
                        </div>
                    </div>
                </div>
                    </article>
                </template>

                <div class="flex flex-col md:col-span-2">
                    <label for="files" class="mb-1">Upload Files:</label>
                    <input type="file" ref="fileInput" multiple @change="handleFileUpload" id="files"
                        class="border rounded p-2" />
                    <!-- Display uploaded files in a carousel -->
                    <div v-if="uploadedFiles.length > 0" class="mt-6">
                        <h3 class="text-xl font-semibold mb-4">Attachments</h3>
                        <UCarousel v-slot="{ item }" :items="uploadedFiles" indicators>
                            <video width="300" height="400" draggable="false" v-if="isVideo(item)" controls
                                class="rounded">
                                <source :src="item.preview" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                            <img width="300" height="400" draggable="false" v-else :src="item.preview" :alt="item.name"
                                class="rounded" />
                        </UCarousel>
                    </div>
                </div>
                <template #footer>
                    <div class="flex justify-center gap-4 w-full px-4">
                        <button type="submit" :disabled="!isAccepted"
                            class="flex-1 bg-blue-500 text-white rounded p-2 max-w-[200px] disabled:opacity-50 disabled:cursor-not-allowed">
                            Submit
                        </button>
                        <button @click="isOpen = false" class="flex-1 bg-red-500 text-white rounded p-2 max-w-[200px]">
                            Cancel
                        </button>
                    </div>
                </template>
            </UCard>
        </form>
    </UModal>


</template>

  
<style scoped>

</style>
