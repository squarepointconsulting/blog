<script setup>
import { useRoute } from 'vue-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { ref } from 'vue';

const route = useRoute();
const homeId = route.params.homeId;
const { $db, $storage } = useNuxtApp();
const homeSource = ref()
const isUploading = ref(false);
const attachmentsRef = ref(null);

const siding = ref({
  squareFeet: '',
  materials: '',
  dateInstalled: '',
  installer: '',
  price: '',
  notes: '',
  files: [],
});

onMounted(() => {
  const docRef = doc($db, "properties", homeId);
  getDoc(docRef).then((docSnap) => {
    if (docSnap.exists()) {
      homeSource.value = docSnap.data()
      if (!homeSource.value.siding) {
        homeSource.value.siding = {
          ...siding.value
        };
      }  
      else {
      siding.value = {
        ...homeSource.value.siding
      }
    }
    }
  })
})

const submitForm = async () => {
  isUploading.value = true;
  try {
    const uploadPromises = attachmentsRef.value.uploadedFiles.map(async (file) => {
      const fileRef = storageRef($storage, `properties/${homeId}/${file.name}`);
      const snapshot = await uploadBytes(fileRef, file.file);
      const url = await getDownloadURL(fileRef);

      if (file.type.startsWith('application/pdf')) {
        const thumbnailRef = storageRef($storage, `properties/${homeId}/${file.name}-thumbnail.png`);
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

    const uploadedFileData = await Promise.all(uploadPromises);
    siding.value.files = [...siding.value.files, ...uploadedFileData];
    const docRef = doc($db, "properties", homeId);
    await updateDoc(docRef, {
      siding: {
        ...siding.value
      },
    }, { merge: true });

  } catch (error) {
    console.error('Error in submitForm:', error);
  } finally {
    attachmentsRef.value.uploadedFiles = [];
    isUploading.value = false;
  }
};


const deleteFile = async (file) => {
  try {
    const fileRef = storageRef($storage, `properties/${homeId}/${file.name}`);
    try {
      await deleteObject(fileRef);
    }
    catch (error) {
      console.warn('Error deleting file:', error);
    }

    // If it's a PDF, also delete the thumbnail
    if (file.type.startsWith('application/pdf')) {
      const thumbnailRef = storageRef($storage, `properties/${homeId}/${file.name}-thumbnail.png`);
      await deleteObject(thumbnailRef);
    }
    siding.value.files = siding.value.files.filter(f => f.url !== file.url);
    const docRef = doc($db, "properties", homeId);
    await updateDoc(docRef, {
      siding: {
        ...siding.value
      },
    });

  } catch (error) {
    console.error('Error deleting file:', error);
  }
};

// Function to handle delete confirmation
const confirmDelete = (file) => {
  fileToDelete.value = file;
  showDeleteConfirm.value = true;
};

// Function to execute delete after confirmation
const handleDeleteConfirm = async () => {
  if (fileToDelete.value) {
    await deleteFile(fileToDelete.value);
    fileToDelete.value = null;
  }
  showDeleteConfirm.value = false;
};


</script>

<template>



  <div v-if="homeSource" class="max-w-4xl mx-auto p-4">
    <form @submit.prevent="submitForm" class="max-w-4xl mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="flex flex-col">
          <label for="squareFeet" class="mb-1">Square Feet:</label>
          <input type="number" v-model="siding.squareFeet" id="squareFeet" class="border rounded p-2"
            placeholder="Enter square feet" />
        </div>
        <div class="flex flex-col">
          <label for="materials" class="mb-1">Materials:</label>
          <input type="text" v-model="siding.materials" id="materials" class="border rounded p-2"
            placeholder="Enter materials" />
        </div>
        <div class="flex flex-col">
          <label for="dateInstalled" class="mb-1">Date Installed:</label>
          <input type="date" v-model="siding.dateInstalled" id="dateInstalled" class="border rounded p-2" />
        </div>
        <div class="flex flex-col">
          <label for="installer" class="mb-1">Installer:</label>
          <input type="text" v-model="siding.installer" id="installer" class="border rounded p-2"
            placeholder="Enter installer name" />
        </div>
        <div class="flex flex-col">
          <label for="price" class="mb-1">Price Paid:</label>
          <input type="number" v-model="siding.price" id="price" class="border rounded p-2" placeholder="Enter price" />
        </div>
        <div class="flex flex-col md:col-span-2">
          <label for="notes" class="mb-1">Notes:</label>
          <textarea v-model="siding.notes" id="notes" class="border rounded p-2" placeholder="Enter notes"
            rows="3"></textarea>
        </div>
        <div class="flex flex-col md:col-span-2">
          <CommonAttachments ref="attachmentsRef" :attachments="siding.files" @fileDeleted="deleteFile" />
        </div>
        <div class="md:col-span-2 mt-4">
          <button type="submit" class="bg-blue-500 text-white rounded p-2 w-full">
            Submit
          </button>
        </div>
      </div>
    </form>

    <!-- Upload Modal -->
    <UModal v-model="isUploading">
      <div class="p-4 flex flex-col items-center">
        <Spinner />
        <p>Uploading files, please wait...</p>
      </div>
    </UModal>
  </div>

</template>

