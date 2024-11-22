<script setup>
import { useRoute, useRouter } from 'vue-router';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { ref } from 'vue';

const route = useRoute();
const router = useRouter();
const homeId = route.params.homeId;
console.log(homeId)
const applianceId = route.params.applianceId;
console.log(applianceId)
const projectId = route.params.projectId;

const isUploading = ref(false);
const attachmentsRef = ref(null);

const { $db, $storage } = useNuxtApp();
const docRef = doc($db, 'properties', homeId, 'appliances', applianceId);

const appliance = useDocument(docRef)

const saveAppliance = async () => {
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
    router.back()
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
    router.back()
    //router.push({ name: 'homes-homeId', params: { homeId: homeId } })
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

const placeholder = ref("https://placehold.co/60x60?text=icon")

const sections = [{
  label: 'Details',
  icon: 'i-mdi-home-outline',
  defaultOpen: false,
  slot: 'details'
}, {
  label: 'Notes',
  icon: 'i-heroicons-arrow-down-tray',
  defaultOpen: false,
  slot: 'notes'
}, {
  label: 'Attachments',
  icon: 'i-heroicons-rectangle-group',
  slot: 'attachments',
},]

const applianceOptions = [
  {
    label: 'Major Appliances',
    children: [
      { value: 'Refrigerator', label: 'Refrigerator' },
      { value: 'Freezer', label: 'Freezer (standalone or part of refrigerator)' },
      { value: 'Stove/Range', label: 'Stove/Range (gas or electric)' },
      { value: 'Microwave', label: 'Microwave Oven' },
      { value: 'Dishwasher', label: 'Dishwasher' },
      { value: 'Wine Cooler', label: 'Wine Cooler' },
    ]
  },
  {
    label: 'Counter Appliances',
    children: [
      { value: 'Toaster', label: 'Toaster or Toaster Oven' },
      { value: 'Coffee Maker', label: 'Coffee Maker or Espresso Machine' },
      { value: 'Blender', label: 'Blender' },
      { value: 'Food Processor', label: 'Food Processor' },
      { value: 'Slow Cooker', label: 'Slow Cooker or Instant Pot' },
      { value: 'Electric Kettle', label: 'Electric Kettle' },
      { value: 'Stand Mixer', label: 'Stand Mixer (e.g., KitchenAid)' },
      { value: 'Air Fryer', label: 'Air Fryer' },
      { value: 'Juicer', label: 'Juicer' },
    ]
  }
];

const files = ref([]);
const handleFileChange = (event) => {
  files.value = event.target.files;
};

const fileInput = ref(null)

const updatePhoto = () => {
  fileInput.value.click()
}

async function updateAppliance() {
  const docRef = doc($db, `properties/${homeId}/appliances/${applianceId}`);
  await updateDoc(docRef, {
    ...appliance.value,
  })
}

// Function to handle the file upload
const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    console.log('Selected file:', file)
    try {
      const fileRef = storageRef($storage, `properties/${homeId}/appliances/${applianceId}/${file.name}`);
      uploadBytes(fileRef, file).then((snapshot) => {
        getDownloadURL(fileRef)
          .then((url) => {
            appliance.value.imageUrl = url
            //editHome.value.imageUrl = url
            //editHome.value.updated_at = serverTimestamp()
            updateAppliance().then(() => {
              // addProject()
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
  <article v-if="appliance" class="p-4 bg-white shadow-md rounded-md">
      <div class="flex w-full">
        <!-- Inner Div 1 -->
        <div class="flex-1 flex flex-col justify-center items-center">
          <div class="w-full flex justify-center items-center">
            <button @click="updatePhoto" class="bg-transparent hover:bg-transparent">
              <img
              class="w-32 h-32 rounded-lg object-cover bg-white" :src="appliance.imageUrl" alt="Appliance Avatar" />
            </button>
          </div>
          <!-- Row 2 -->
          <div class="w-full flex justify-center items-center p-1">
            <p class=""></p>
          </div>
          <div>
            <input type="file" accept="image/*" @change="handleFileUpload" hidden ref="fileInput" />
          </div>
        </div>
        <!-- Inner Div 2 -->
        <div class="flex-1 flex flex-col justify-center items-center">
          <!-- Row 1 -->
          <div class="w-full flex justify-center items-center">
            <p>{{ appliance.manufacturer }}</p>
          </div>
          <!-- Row 2 -->
          <div class="w-full flex justify-center items-center">
            <p class="font-bold text-center">{{ appliance.category }}</p>
          </div>
          <div class="w-full flex justify-center items-center">
            <div class="md:col-span-2 mt-6 flex justify-end gap-2">
              <button type="button" @click="router.back()"
                class="px-3 py-1.5 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600 transition duration-200 flex items-center gap-1.5">
                <UIcon name="i-heroicons-arrow-left" class="w-3.5 h-3.5" />
                Cancel
              </button>
              <button type="submit" @click="saveAppliance"
                class="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition duration-200 flex items-center gap-1.5">
                <UIcon name="i-heroicons-check" class="w-3.5 h-3.5" />
                Save
              </button>
              <button @click="confirmDeleteAppliance"
                class="px-3 py-1.5 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition duration-200 flex items-center gap-1.5">
                <UIcon name="i-heroicons-trash" class="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <p class="pt-4"></p>
        <UAccordion :items="sections" color="gray">
          <template #item="{ item }">
            <p class="italic text-gray-900 dark:text-white text-center">
              {{ item.description }}
            </p>
          </template>
          <template #details>
            <!-- Main Form Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Model -->
              <div class="flex flex-col">
                <label class="text-sm font-medium text-gray-600 mb-1">
                  Model Number
                </label>
                <input type="text" v-model="appliance.model"
                  class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter model number" />
              </div>

              <!-- Serial Number -->
              <div class="flex flex-col">
                <label class="text-sm font-medium text-gray-600 mb-1">
                  Serial Number
                </label>
                <input type="text" v-model="appliance.serialNumber"
                  class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter serial number" />
              </div>

              <!-- Purchase Date -->
              <div class="flex flex-col">
                <label class="text-sm font-medium text-gray-600 mb-1">
                  Date of Purchase
                </label>
                <input type="date" v-model="appliance.purchaseDate"
                  class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>

              <!-- Purchase Location -->
              <div class="flex flex-col">
                <label class="text-sm font-medium text-gray-600 mb-1">
                  Purchase Location
                </label>
                <input type="text" v-model="appliance.purchaseLocation"
                  class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Where was it purchased?" />
              </div>

            </div>

          </template>

          <template #notes>
            <div class="space-y-2">
    <textarea
      v-model="appliance.notes"
      rows="4"
      class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
      placeholder="Enter any notes about this appliance (maintenance history, special instructions, etc.)"
      @change="updateAppliance"
    ></textarea>
  </div>
          </template>
          <template #attachments>
            <CommonAttachments ref="attachmentsRef" :attachments="appliance.attachments" @fileDeleted="deleteFile" />
          </template>
        </UAccordion>
      </div>

  </article>

  <!-- Loading Modal -->
  <UModal v-model="isUploading">
    <div class="p-4 flex flex-col items-center">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin mb-2" />
      <p>Uploading files, please wait...</p>
    </div>
  </UModal>


</template>
