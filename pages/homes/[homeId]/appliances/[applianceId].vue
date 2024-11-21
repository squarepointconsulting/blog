<script setup>
import { useRoute } from 'vue-router';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { ref } from 'vue';

const route = useRoute();
const router = useRouter();
const homeId = route.params.homeId;
console.log(homeId)
const applianceId  = route.params.applianceId;
console.log(applianceId)
const projectId = route.params.projectId;

const isUploading = ref(false);
const attachmentsRef = ref(null);

const { $db, $storage } = useNuxtApp();
const docRef = doc($db, 'properties', homeId, 'appliances', applianceId);

const appliance = useDocument(docRef)

const submitForm = async () => {
  isUploading.value = true;
  try {
    // Create an array of promises for file uploads
    const uploadPromises = attachmentsRef.value.uploadedFiles.map(async (file) => {
      const fileRef = storageRef($storage, `properties/${homeId}/appliances/${applianceId}/${file.name}`);
      const snapshot = await uploadBytes(fileRef, file.file);
      const url = await getDownloadURL(fileRef);

      if (file.type.startsWith('application/pdf')) {
        const thumbnailRef = storageRef($storage, `properties/${homeId}/appliances/${applianceId}/${file.name}-thumbnail.png`);
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

    appliance.value.attachments = [...appliance.value.attachments, ...uploadedFileData];
    const docRef = doc($db, 'properties', homeId, 'appliances', applianceId)
    await updateDoc(docRef, { ...appliance.value }, { merge: true });

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
    const fileRef = storageRef($storage, `properties/${homeId}/appliances/${applianceId}/${file.name}`);
    try {
      await deleteObject(fileRef);
    }
    catch (error) {
      console.warn('Error deleting file:', error);
    }

    // If it's a PDF, also delete the thumbnail
    if (file.type.startsWith('application/pdf')) {
      const thumbnailRef = storageRef($storage, `properties/${homeId}/appliances/${applianceId}/${file.name}-thumbnail.png`);
      await deleteObject(thumbnailRef);
    }

    appliance.value.attachments = appliance.value.attachments.filter(f => f.url !== file.url);
    console.log(appliance.value.attachments)
    const docRef = doc($db, 'properties', homeId, 'appliances', applianceId)
    await updateDoc(docRef, { ...appliance.value });

  } catch (error) {
    console.error('Error deleting file:', error);
  }
};

const confirmDeleteAppliance = async () => {
  const confirmed = confirm("Are you sure you want to delete this appliance? This action cannot be undone.");
  if (confirmed) {
    await deleteAppliance();
  }
};

// Function to delete the appliance
const deleteAppliance = async () => {
  try {
    // Delete all associated files from Firebase Storage
    if (appliance.value.attachments && appliance.value.attachments.length > 0) {
      for (const file of appliance.value.attachments) {
        const fileRef = storageRef($storage, `properties/${homeId}/appliances/${applianceId}/${file.name}`);
        try { await deleteObject(fileRef); }
        catch (error) {
          console.log('Error deleting file:', error);
          //alert("An error occurred while deleting the appliance.");
        }

        // If it's a PDF, also delete the thumbnail
        if (file.type.startsWith('application/pdf')) {
          const thumbnailRef = storageRef($storage, `properties/${homeId}/appliances/${applianceId}/${file.name}-thumbnail.png`);

          try { await deleteObject(thumbnailRef); }
          catch (error) {
            console.log('Error deleting file:', error);
          }
        }
      }
    }

    // Delete the appliance record from Firestore
    const docRef = doc($db, 'properties', homeId, 'appliances', applianceId);
    await deleteDoc(docRef);
    router.push({ name: 'homes-homeId', params: { homeId: homeId } })
  } catch (error) {
    console.error('Error deleting appliance:', error);
    alert("An error occurred while deleting the appliance.");
  }
};

const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A';
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
};

</script>

<template>
  <div v-if="appliance" class="max-w-4xl mx-auto p-4">
    <form @submit.prevent="submitForm" class="max-w-4xl mx-auto">
      <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
        <!-- Header Section -->
        <div class="border-b pb-4 mb-6">
          <h1 class="text-2xl font-bold text-gray-900">Appliance Details</h1>
        </div>

        <!-- Main Form Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Category -->
          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-600 mb-1">
              Category
            </label>
            <input 
              type="text" 
              v-model="appliance.category"
              class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., Dishwasher"
            />
          </div>

          <!-- Manufacturer -->
          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-600 mb-1">
              Manufacturer
            </label>
            <input 
              type="text" 
              v-model="appliance.manufacturer"
              class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., Maytag"
            />
          </div>

          <!-- Model -->
          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-600 mb-1">
              Model Number
            </label>
            <input 
              type="text" 
              v-model="appliance.model"
              class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter model number"
            />
          </div>

          <!-- Serial Number -->
          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-600 mb-1">
              Serial Number
            </label>
            <input 
              type="text" 
              v-model="appliance.serialNumber"
              class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter serial number"
            />
          </div>

          <!-- Purchase Date -->
          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-600 mb-1">
              Date of Purchase
            </label>
            <input 
              type="date" 
              v-model="appliance.dateOfPurchase"
              class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <!-- Purchase Location -->
          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-600 mb-1">
              Purchase Location
            </label>
            <input 
              type="text" 
              v-model="appliance.purchaseLocation"
              class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Where was it purchased?"
            />
          </div>

          <!-- Created By Info -->
          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-600 mb-1">
              Created By
            </label>
            <p class="text-gray-900 py-2">
              {{ appliance.createdByDisplayName || 'Unknown User' }}
            </p>
          </div>

          <!-- Created At -->
          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-600 mb-1">
              Created On
            </label>
            <p class="text-gray-900 py-2">
              {{ formatDate(appliance.createdAt) }}
            </p>
          </div>

          <!-- Attachments Section -->
          <div class="md:col-span-2">
            <label class="text-sm font-medium text-gray-600 mb-1">
              Attachments
            </label>
            <CommonAttachments 
              ref="attachmentsRef" 
              :attachments="appliance.attachments" 
              @fileDeleted="deleteFile" 
            />
          </div>

          <!-- Action Buttons -->
          <div class="md:col-span-2 mt-6 flex gap-4">
            <button 
              type="submit"
              class="flex-1 bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition duration-200 flex items-center justify-center gap-2"
            >
              <UIcon name="i-heroicons-check" class="w-5 h-5" />
              Save Changes
            </button>
            <button 
              @click="confirmDeleteAppliance"
              class="flex-1 bg-red-500 text-white rounded-lg px-4 py-2 hover:bg-red-600 transition duration-200 flex items-center justify-center gap-2"
            >
              <UIcon name="i-heroicons-trash" class="w-5 h-5" />
              Delete Appliance
            </button>
          </div>
        </div>
      </div>
    </form>

    <!-- Loading Modal -->
    <UModal v-model="isUploading">
      <div class="p-4 flex flex-col items-center">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin mb-2" />
        <p>Uploading files, please wait...</p>
      </div>
    </UModal>
  </div>
</template>
