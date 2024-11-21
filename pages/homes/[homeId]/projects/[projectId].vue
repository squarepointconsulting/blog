<script setup>
import { useRoute } from 'vue-router';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { ref } from 'vue';

const route = useRoute();
const router = useRouter();
const homeId = route.params.homeId;
const projectId = route.params.projectId;
const isUploading = ref(false);
const attachmentsRef = ref(null);

const { $db, $storage } = useNuxtApp();
const docRef = doc($db, 'properties', homeId, 'project_records', projectId);
const project = useDocument(docRef)


const submitForm = async () => {
  isUploading.value = true;
  try {
    // Create an array of promises for file uploads
    const uploadPromises = attachmentsRef.value.uploadedFiles.map(async (file) => {
      const fileRef = storageRef($storage, `properties/${homeId}/project_records/${projectId}/${file.name}`);
      const snapshot = await uploadBytes(fileRef, file.file);
      const url = await getDownloadURL(fileRef);

      if (file.type.startsWith('application/pdf')) {
        const thumbnailRef = storageRef($storage, `properties/${homeId}/project_records/${projectId}/${file.name}-thumbnail.png`);
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

    project.value.attachments = [...project.value.attachments, ...uploadedFileData];
    const docRef = doc($db, 'properties', homeId, 'project_records', projectId)
    await updateDoc(docRef, { ...project.value }, { merge: true });

  } catch (error) {
    console.error('Error in submitForm:', error);
  } finally {
    attachmentsRef.value.uploadedFiles = [];
    isUploading.value = false;
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

    project.value.attachments = project.value.attachments.filter(f => f.url !== file.url);
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
    if (project.value.attachments.length > 0) {
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
    <form @submit.prevent="submitForm" class="max-w-4xl mx-auto px-4">

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
        <div class="flex flex-col md:col-span-2">
          <CommonAttachments ref="attachmentsRef" :attachments="project.attachments" @fileDeleted="deleteFile" />
        </div>
        <div class="md:col-span-2 mt-4 flex justify-between">
          <button type="submit"
            class="bg-blue-500 text-white rounded p-3 w-1/2 hover:bg-blue-600 transition duration-200">
            Submit
          </button>
          <button @click="confirmDeleteProject"
            class="bg-red-500 text-white rounded p-3 w-1/2 ml-4 hover:bg-red-600 transition duration-200">
            Delete Project
          </button>
        </div>
      </div>
    </div>
  </form>

    <UModal v-model="isUploading">
      <div class="p-4 flex flex-col items-center">
        <p>Uploading files, please wait...</p>
      </div>
    </UModal>
  </div>

</template>
