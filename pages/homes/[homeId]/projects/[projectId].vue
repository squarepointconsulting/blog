<script setup>

import { useRoute } from 'vue-router';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { ref } from 'vue';


const route = useRoute();
const router = useRouter();
const homeId = route.params.homeId;
const projectId = route.params.projectId;

const { $db, $storage } = useNuxtApp();
const docRef = doc($db, 'properties', homeId, 'project_records', projectId);
const project = useDocument(docRef)
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
const showDeleteConfirm = ref(false);

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
    projectSource.value.files = [...projectSource.value.files, ...uploadedFileData];
    const docRef = doc($db, 'properties', homeId, 'project_records', projectId)

    await updateDoc(docRef, { ...projectSource.value }, { merge: true });

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
    const fileRef = storageRef($storage, `properties/${homeId}/project_records/${projectId}/${file.name}`);
    await deleteObject(fileRef);

    // If it's a PDF, also delete the thumbnail
    if (file.type.startsWith('application/pdf')) {
      const thumbnailRef = storageRef($storage, `properties/${homeId}/project_records/${projectId}/${file.name}-thumbnail.png`);
      await deleteObject(thumbnailRef);
    }

    project.value.files = project.value.files.filter(f => f.url !== file.url);
    const docRef = doc($db, 'properties', homeId, 'project_records', projectId)
    await updateDoc(docRef, {
      project: {
        ...project.value
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

// Function to confirm deletion
const confirmDeleteProject = async () => {
  const confirmed = confirm("Are you sure you want to delete this project? This action cannot be undone.");
  if (confirmed) {
    await deleteProject();
  }
};

// Function to delete the project
const deleteProject = async () => {
  try {
    // Delete all associated files from Firebase Storage
    if (project.value.attachments.length > 0)
  {
    for (const file of project.value.attachments) {
      const fileRef = storageRef($storage, `properties/${homeId}/project_records/${projectId}/${file.name}`);
      try { await deleteObject(fileRef); }
      catch (error) {
        console.log('Error deleting file:', error);
        //alert("An error occurred while deleting the project.");
      }

      // If it's a PDF, also delete the thumbnail
      if (file.type.startsWith('application/pdf')) {
        const thumbnailRef = storageRef($storage, `properties/${homeId}/project_records/${projectId}/${file.name}-thumbnail.png`);

        try { await deleteObject(thumbnailRef); }
        catch (error) {
          console.log('Error deleting file:', error);
          //alert("An error occurred while deleting the project.");
        }
      }
    }
  }

    // Delete the project record from Firestore
    const docRef = doc($db, 'properties', homeId, 'project_records', projectId);
    await deleteDoc(docRef);

    // Optionally, redirect or show a success message
    // alert("Project deleted successfully.");
    // Redirect to the project list or home page
    // router.push(`/homes/${homeId}/projects`);
    router.push({ name: 'homes-homeId', params: { homeId: homeId } })
  } catch (error) {
    console.error('Error deleting project:', error);
    alert("An error occurred while deleting the project.");
  }
};

</script>

<template>
  <div v-if="project" class="max-w-4xl mx-auto p-4">

    <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div class="md:col-span-2">
          <p class="font-bold">{{ project.type }}</p>

        </div>

        <!-- User Display Name -->
        <div class="flex flex-col">
          <label class="text-sm font-medium text-gray-600 mb-1">
            Created By
          </label>
          <p class="text-gray-900">
            {{ project.completedByUserDisplayName || 'Unknown User' }}
          </p>
        </div>

        <!-- Timestamp -->
        <div class="flex flex-col">
          <label class="text-sm font-medium text-gray-600 mb-1">
            Created On
          </label>
          <p class="text-gray-900">
            {{ project.timestamp?.toDate().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              hour12: true
            }) }}
          </p>
        </div>

        <!-- Notes -->
        <div class="md:col-span-2">
          <label for="notes" class="block text-sm font-medium text-gray-600 mb-1">
            Notes
          </label>
          <textarea id="notes" v-model="project.notes" rows="4"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Add project notes here..."></textarea>
        </div>
        <div v-if="project.attachments.length > 0" class="flex flex-col md:col-span-2">
          <UCarousel v-slot="{ item }" :items="project.attachments" indicators>
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
      </div>
    </div>

    <div class="flex flex-col md:col-span-2">
      <label for="files" class="mb-1">Upload Files:</label>
      <input type="file" ref="fileInput" multiple @change="handleFileUpload" id="files" class="border rounded p-2" />
      <!-- Display uploaded files in a carousel -->
      <div v-if="uploadedFiles.length > 0" class="mt-6">
        <h3 class="text-xl font-semibold mb-4">Attachments</h3>
        <UCarousel v-slot="{ item }" :items="uploadedFiles" indicators>
          <video width="300" height="400" draggable="false" v-if="isVideo(item)" controls class="rounded">
            <source :src="item.preview" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <img width="300" height="400" draggable="false" v-else :src="item.preview" :alt="item.name" class="rounded" />
        </UCarousel>
      </div>
    </div>
    <div class="md:col-span-2 mt-4 flex justify-between">
  <button 
    type="submit" 
    class="bg-blue-500 text-white rounded p-3 w-1/2 hover:bg-blue-600 transition duration-200"
  >
    Submit
  </button>
  <button 
    @click="confirmDeleteProject" 
    class="bg-red-500 text-white rounded p-3 w-1/2 ml-4 hover:bg-red-600 transition duration-200"
  >
    Delete Project
  </button>
</div>


    <!-- Upload Modal -->
    <UModal v-model="isUploading">
      <div class="p-4 flex flex-col items-center">
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
