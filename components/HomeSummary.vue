<script setup>
import { onMounted, ref } from 'vue'
import { collection, addDoc, getDoc, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import GaugeChart from '~/components/GaugeChart.vue'

const { $db, $storage } = useNuxtApp();
const homeSource = ref()
const router = useRouter();
const isEditing = ref(false);

const editHome = ref({
    address: {
        city: "",
        state: "",
        street1: "",
        street2: "",
        zip: "",
    },
    currentAppraisedValue: 0,
    geoip: "",
    villaFactScore: 0,
    imageUrl: "",
    ownerId: "",
    updated_at: null,
    project_records: [],
})

// When homeSource is updated
watch(homeSource, (homeSource) => {
    // Update the editHome with the appropriate values
    editHome.value = {
        ...homeSource,
    }
})

const props = defineProps({
    homeId: {
        type: String,
        required: true,
    },
});

async function updateHome() {
    const docRef = doc($db, "properties", props.homeId);
    await updateDoc(docRef, {
        ...editHome.value,
    })
    isEditing.value = false
}



async function addProject() {
    const user = await useCurrentUser()
    console.log(user.value)
    const updated_at_timestamp = serverTimestamp()
    const projectRecord = {
        type: "property_avatar",
        timestamp: updated_at_timestamp,
        completedByUserUid: user.value.uid,
        completedByUserDisplayName: user.value.displayName,
        attachments: [],
    }
    // Get a reference to the home document. Or do we have that already?

    console.log(projectRecord)
    const docRef = await addDoc(collection($db, "properties", props.homeId, "project_records"), projectRecord);
    console.log("Document written with ID: ", docRef.id);
}

async function deleteHome() {
    await deleteDoc(doc($db, "properties", props.homeId))
    router.push('/profile');
}

onMounted(() => {
    const docRef = doc($db, "properties", props.homeId);
    getDoc(docRef).then((docSnap) => {
        if (docSnap.exists()) {
            homeSource.value = docSnap.data()
        } else {
            console.error("No such document!");
        }
    })
})

const files = ref([]);
const handleFileChange = (event) => {
    files.value = event.target.files;
};

const fileInput = ref(null)

const updatePhoto = () => {
    fileInput.value.click()
}

// Function to handle the file upload
const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
        console.log('Selected file:', file)

        try {
            const fileRef = storageRef($storage, `properties/${props.homeId}/${file.name}`);
            uploadBytes(fileRef, file).then((snapshot) => {
                getDownloadURL(fileRef)
                    .then((url) => {
                        homeSource.value.imageUrl = url
                        editHome.value.imageUrl = url
                        editHome.value.updated_at = serverTimestamp()
                        editHome.value.villaFactScore =  homeSource.value.villaFactScore * 1.1
                        homeSource.value.villaFactScore = editHome.value.villaFactScore
                        updateHome().then(() => {
                            addProject()
                        })
                    })
            });
        }
        catch (error) {
            console.error('Error uploading files:', error);
            alert('Failed to upload files.');
        }
    }
}

</script>
<template>
    <article v-if="homeSource && !isEditing" class="p-4 bg-white shadow-md rounded-md">
        <div class="flex w-full">
            <!-- Inner Div 1 -->
            <div class="flex-1 flex flex-col justify-center items-center">
                <div class="w-full flex justify-center items-center">
                    <UButton @click="updatePhoto" class="bg-transparent hover:bg-transparent">
                        <img class="w-24 h-24 rounded-full object-fill" style="text-align: center;"
                            :src="homeSource.imageUrl" alt="{{ homeSource.address.street1 }}" />
                    </UButton>
                </div>
                <!-- Row 2 -->
                <div class="w-full flex justify-center items-center p-1">
                    <p class="">{{ homeSource.address.street1 }}</p>
                </div>
                <div>
                    <input type="file" accept="image/*" @change="handleFileUpload" hidden ref="fileInput" />
                </div>
            </div>
            <!-- Inner Div 2 -->
            <div class="flex-1 flex flex-col justify-center items-center">
                <!-- Row 1 -->
                <div class="w-full flex justify-center items-center">
                    <div class="chart-container">
                        <GaugeChart :villaFactScore="Math.round(homeSource.villaFactScore)" />
                    </div>
                </div>
                <!-- Row 2 -->
                <div class="w-full flex justify-center items-center">
                    <p class="font-bold text-center">{{ Math.round(homeSource.villaFactScore ? homeSource.villaFactScore :
                        homeSource.villafactScore) }}</p>
                </div>
            </div>
            <!-- Edit Button -->
            <div class="relative top-2 right-2">
                <UButton @click="isEditing = true" icon="i-heroicons-pencil-square" class="focus:outline-none">
                </UButton>
            </div>

        </div>
    </article>
    <transition name="fade">
        <article v-if="homeSource && isEditing" class="p-4 bg-white shadow-md rounded-md relative">
            <div class="flex flex-col space-y-2">
                <UInput v-model="homeSource.address.street1" type="text" placeholder="Street 1"
                    class="p-2 border-gray-300 rounded-md" />
                <UInput v-model="homeSource.address.street2" type="text" placeholder="Street 2"
                    class="p-2  border-gray-300 rounded-md" />
                <UInput v-model="homeSource.address.city" type="text" placeholder="City"
                    class="p-2 border-gray-300 rounded-md" />
                <UInput v-model="homeSource.address.state" type="text" placeholder="State"
                    class="p-2 border-gray-300 rounded-md" />
                <UInput v-model="homeSource.address.zip" type="text" placeholder="Zip Code"
                    class="p-2 border-gray-300 rounded-md" />
            </div>
            <div class="absolute top-2 right-2">
                <UButton @click="isEditing = false" icon="i-heroicons-x-circle" class="focus:outline-none">
                </UButton>
            </div>
            <div class="flex place-content-center space-x-4">
                <!-- Right slot for icons -->
                <slot name="right-icons">
                    <span>
                        <UButton @click="updateHome" icon="i-heroicons-check-circle" class="" />
                    </span>
                    <span>
                        <UButton @click="deleteHome" label="Delete Home" class=" bg-red-700 " />
                    </span>
                </slot>
            </div>

            <!-- Hidden File Input -->
            <input ref="fileInput" type="file" class="hidden" @change="handleFileChange" />
        </article>
    </transition>
    <article v-if="!homeSource" class="p-4 bg-white shadow-md rounded-md">

        <div class="flex items-center space-x-4">
            <USkeleton class="h-12 w-12" :ui="{ rounded: 'rounded-full' }" />
            <div class="space-y-2">
                <USkeleton class="h-4 w-[250px]" />
                <USkeleton class="h-4 w-[200px]" />
            </div>
        </div>


    </article>
</template>

<style scoped>
.chart-container {
    height: 100px;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active in <2.1.8 */
    {
    opacity: 0;
}
</style>
