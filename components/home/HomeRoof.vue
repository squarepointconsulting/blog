<script setup>
import { useDeleteConfirmation } from '@/composables/useDeleteConfirmation';
import { useRoute } from 'vue-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { ref } from 'vue';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf';

GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString();

const showDeleteConfirm = ref(false);
const fileToDelete = ref(null);

const route = useRoute();
const homeId = route.params.homeId;
const { $db, $storage } = useNuxtApp();
const homeSource = ref()

onMounted(() => {
  const docRef = doc($db, "properties", homeId);
  getDoc(docRef).then((docSnap) => {
    if (docSnap.exists()) {
      homeSource.value = docSnap.data()
      if (!homeSource.value.roof) {
        homeSource.value.roof = {
          squareFeet: '',
          materials: '',
          dateInstalled: '',
          installer: '',
          price: '',
          notes: '',
          files: [],
        };
      }
      roof.value = {
        ...homeSource.value.roof
      }
    }
  })
})

const roof = ref({
  squareFeet: '',
  materials: '',
  dateInstalled: '',
  installer: '',
  price: '',
  notes: '',
  files: [],
});

const uploadedFiles = ref([]);
const fileInput = ref(null);

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
  isUploading.value = true;
  try {
    // Create an array of promises for file uploads
    const uploadPromises = uploadedFiles.value.map(async (file) => {
      const fileRef = storageRef($storage, `properties/${homeId}/${file.name}`);
      const snapshot = await uploadBytes(fileRef, file.file);
      const url = await getDownloadURL(fileRef);

      if (file.type.startsWith('application/pdf')) {
        const thumbnailRef = storageRef($storage, `properties/${homeId}/${file.name}-thumbnail.png`);
        const thumbnailSnapshot = await uploadBytes(thumbnailRef, file.preview_file);
        const thumbnailUrl = await getDownloadURL(thumbnailRef);
        console.log('Thumbnail uploaded:', thumbnailUrl);
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
    roof.value.files = [...roof.value.files, ...uploadedFileData];
    const docRef = doc($db, "properties", homeId);
    await updateDoc(docRef, {
      roof: {
        ...roof.value
      },
    }, { merge: true });

  } catch (error) {
    console.error('Error in submitForm:', error);
  } finally {
    uploadedFiles.value = [];
    isUploading.value = false;

    // Clear the file input
    if (fileInput.value) {
      fileInput.value.value = '';
    }
    //router.push('/profile')
  }
};


// Add this function to handle file deletion
const deleteFile = async (file) => {
  try {
    // Delete file from Storage
    const fileRef = storageRef($storage, `properties/${homeId}/${file.name}`);
    await deleteObject(fileRef);

    // If it's a PDF, also delete the thumbnail
    if (file.type.startsWith('application/pdf')) {
      const thumbnailRef = storageRef($storage, `properties/${homeId}/${file.name}-thumbnail.png`);
      await deleteObject(thumbnailRef);
    }

    roof.value.files = roof.value.files.filter(f => f.url !== file.url);
    const docRef = doc($db, "properties", homeId);
    await updateDoc(docRef, {
      roof: {
        ...roof.value
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
          <input type="number" v-model="roof.squareFeet" id="squareFeet" class="border rounded p-2"
            placeholder="Enter square feet" />
        </div>
        <div class="flex flex-col">
          <label for="materials" class="mb-1">Materials:</label>
          <input type="text" v-model="roof.materials" id="materials" class="border rounded p-2"
            placeholder="Enter materials" />
        </div>
        <div class="flex flex-col">
          <label for="dateInstalled" class="mb-1">Date Installed:</label>
          <input type="date" v-model="roof.dateInstalled" id="dateInstalled" class="border rounded p-2" />
        </div>
        <div class="flex flex-col">
          <label for="installer" class="mb-1">Installer:</label>
          <input type="text" v-model="roof.installer" id="installer" class="border rounded p-2"
            placeholder="Enter installer name" />
        </div>
        <div class="flex flex-col">
          <label for="price" class="mb-1">Price Paid:</label>
          <input type="number" v-model="roof.price" id="price" class="border rounded p-2" placeholder="Enter price" />
        </div>
        <div class="flex flex-col md:col-span-2">
          <label for="notes" class="mb-1">Notes:</label>
          <textarea v-model="roof.notes" id="notes" class="border rounded p-2" placeholder="Enter notes"
            rows="3"></textarea>
        </div>
        <div v-if="roof.files.length > 0" class="flex flex-col md:col-span-2">
          <UCarousel v-slot="{ item }" :items="roof.files" indicators>
            <div class="relative group">
              <video v-if="isVideo(item)" width="300" height="400" draggable="false" controls class="rounded">
                <source :src="item.preview" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <img v-else width="300" height="400" draggable="false" :src="item.preview" :alt="item.name"
                class="rounded" />

              <!-- Hover Controls -->
              <div
                class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-4">
                <a :href="item.url" target="_blank" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                  <UIcon name="i-heroicons-arrow-down-tray" class="w-5 h-5" />
                </a>
                <button @click.prevent="confirmDelete(item)"
                  class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
                  <UIcon name="i-heroicons-trash" class="w-5 h-5" />
                </button>
              </div>
            </div>
          </UCarousel>
        </div>
        <div class="flex flex-col md:col-span-1">
          <label for="files" class="mb-1">Upload Files:</label>
          <input type="file" ref="fileInput" multiple @change="handleFileUpload" id="files" class="hidden" />
          <button 
            @click="$refs.fileInput.click()" 
            class="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition duration-200 flex items-center justify-center"
            aria-label="Choose Files"
          >
            <UIcon name="i-heroicons-plus" class="w-5 h-5" aria-hidden="true" />
          </button>
          <!-- Display uploaded files in a carousel -->
          <div v-if="uploadedFiles.length > 0" class="mt-6">
            <h3 class="text-xl font-semibold mb-4">Attachments</h3>
            <UCarousel v-slot="{ item }" :items="uploadedFiles" indicators>
              <video width="300" height="400" draggable="false" v-if="isVideo(item)" controls class="rounded">
                <source :src="item.preview" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <img width="300" height="400" draggable="false" v-else :src="item.preview" :alt="item.name"
                class="rounded" />
            </UCarousel>
          </div>
        </div>
        <div class="md:col-span-2 mt-4">
          <button type="submit" class="bg-blue-500 text-white rounded p-2 w-full">
            Save Changes
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

  <UModal v-model="showDeleteConfirm">
    <div class="p-4">
      <h3 class="text-lg font-semibold mb-4">Confirm Delete</h3>
      <p class="mb-4">Are you sure you want to delete this file?</p>
      <div class="flex justify-end gap-4">
        <button @click="showDeleteConfirm = false" class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
          Cancel
        </button>
        <button @click="handleDeleteConfirm" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
          Delete
        </button>
      </div>
    </div>
  </UModal>
</template>

<style scoped>
.carousel-container {
  max-width: 800px;
  margin: 0 auto;
}

.carousel-image {
  width: 100%;
  height: auto;
  border-radius: 10px;
}

.group {
  position: relative;
}

.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}

.transition-opacity {
  transition: opacity 0.2s ease-in-out;
}
</style>
