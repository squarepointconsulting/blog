<template>
  <div class="max-w-2xl mx-auto">
    <!-- Stepper showing progress -->
    <div class="mb-8">
      <div class="flex justify-between text-sm mb-2">
        <span class="text-gray-600">Step {{ currentStep }} of {{ steps.length }}</span>
        <span class="font-medium">{{ steps[currentStep - 1].title }}</span>
      </div>
      <UProgress
        :value="(currentStep / steps.length) * 100"
        color="primary"
        class="h-2"
      />
    </div>

    <!-- Wizard Content -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <!-- Step 1: Appliance Type Selection -->
      <div v-if="currentStep === 1">
        <h2 class="text-xl font-semibold mb-4">Select Appliance Type</h2>
        
        <!-- Common Appliance Types Grid -->
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <button
            v-for="type in commonApplianceTypes"
            :key="type.value"
            @click="selectApplianceType(type)"
            class="p-4 border rounded-lg hover:border-blue-500 transition-colors duration-200 flex flex-col items-center gap-2"
            :class="{ 'border-blue-500 bg-blue-50': selectedType?.value === type.value }"
          >
            <UIcon :name="type.icon" class="w-12 h-12 text-gray-600"/>
            <span class="text-sm text-center">{{ type.label }}</span>
          </button>
        </div>

        <!-- More Types Expandable Section -->
        <div class="mt-6">
          <button 
            @click="isMoreTypesOpen = !isMoreTypesOpen"
            class="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <UIcon 
              :name="isMoreTypesOpen ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'" 
              class="w-5 h-5"
            />
            More Appliance Types
          </button>

          <div 
            v-show="isMoreTypesOpen" 
            class="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4"
          >
            <button
              v-for="type in moreApplianceTypes"
              :key="type.value"
              @click="selectApplianceType(type)"
              class="p-4 border rounded-lg hover:border-blue-500 transition-colors duration-200 flex flex-col items-center gap-2"
              :class="{ 'border-blue-500 bg-blue-50': selectedType?.value === type.value }"
            >
              <UIcon :name="type.icon" class="w-12 h-12 text-gray-600"/>
              <span class="text-sm text-center">{{ type.label }}</span>
            </button>
          </div>
        </div>

        <!-- Other Type Input -->
        <div class="mt-6">
          <label class="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              v-model="isOtherType"
              class="rounded text-blue-500"
            />
            <span>Other Appliance Type</span>
          </label>
          <input
            v-if="isOtherType"
            v-model="otherTypeValue"
            type="text"
            placeholder="Enter appliance type"
            class="w-full border rounded-md px-3 py-2"
          />
        </div>
      </div>

      <!-- Step 2: Manufacturer & Serial Number -->
      <div v-if="currentStep === 2">
        <h2 class="text-xl font-semibold mb-4">{{ isOtherType.value ? otherTypeValue.value : selectedType.label }} Details</h2>
                <!-- Photo Upload -->
                <div class="border-t pt-6">
          <p v-if="!previewImage" class="text-sm text-gray-600 mb-4">Please take a photo of your appliance to help identify it.</p>
          
          <!-- Image Preview -->
          <div v-if="previewImage" class="mb-4">
            <div class="relative w-48 h-48 mx-auto">
              <img 
                :src="previewImage" 
                class="w-full h-full object-cover rounded-lg border-2 border-gray-200"
                alt="Appliance photo preview"
              />
              <button 
                @click="clearPhoto"
                class="absolute top-2 right-2 p-1 bg-gray-800 bg-opacity-50 rounded-full text-white hover:bg-opacity-70"
              >
                <UIcon name="i-heroicons-x-mark" class="w-4 h-4"/>
              </button>
            </div>
          </div>

          <!-- Upload Button -->
          <div class="flex justify-center">
            <input
              type="file"
              accept="image/*"
              capture="environment"
              @change="handlePhotoUpload"
              class="hidden"
              ref="photoInput"
            />
            <button v-if="!previewImage"
              @click="$refs.photoInput.click()"
              class="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg"
              :disabled="isProcessing"
            >
              <UIcon :name="isProcessing ? 'i-heroicons-arrow-path' : 'i-heroicons-camera'" 
                class="w-5 h-5"
                :class="{ 'animate-spin': isProcessing }"
              />
              {{ isProcessing ? 'Processing...' : 'Take Photo' }}
            </button>
          </div>
        </div>

        <!-- Manual Input -->
        <div class="space-y-4 mb-6 pt-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
            <div class="space-y-2">
              <select
                v-model="selectedManufacturer"
                class="w-full border rounded-md px-3 py-2 bg-white"
                @change="handleManufacturerChange"
              >
                <option value="">Select a manufacturer</option>
                <optgroup label="Common Manufacturers">
                  <option v-for="mfg in commonManufacturers" :key="mfg" :value="mfg">
                    {{ mfg }}
                  </option>
                </optgroup>
                <option value="other">Other</option>
              </select>

              <!-- Input field for custom manufacturer -->
              <input
                v-if="selectedManufacturer === 'other'"
                v-model="manufacturer"
                type="text"
                placeholder="Enter manufacturer name"
                class="w-full border rounded-md px-3 py-2"
              />
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
            <input
              v-model="serialNumber"
              type="text"
              class="w-full border rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Model</label>
            <input
              v-model="applianceModel"
              type="text"
              class="w-full border rounded-md px-3 py-2"
            />
          </div>
        </div>

      </div>

      <!-- Step 3: Purchase Information -->
      <div v-show="currentStep === 3">
        <h2 class="text-xl font-semibold mb-4">Purchase Information</h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Purchase Location</label>
            <input
              v-model="purchaseLocation"
              type="text"
              class="w-full border rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Purchase Date</label>
            <input
              v-model="purchaseDate"
              type="date"
              class="w-full border rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Attachments (optional) such as receipts or manuals.</label>
            <CommonAttachments
              ref="attachmentsRef"
              :attachments="attachments"
              @fileDeleted="handleFileDeleted"
            />
          </div>
        </div>
      </div>

      <!-- Step 4: Summary -->
      <div v-if="currentStep === 4">
        <h2 class="text-xl font-semibold mb-4">Summary</h2>
        
        <div class="space-y-4 text-sm">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="font-medium text-gray-700">Type:</p>
              <p>{{ isOtherType ? otherTypeValue : selectedType?.label }}</p>
            </div>
            <div>
              <p class="font-medium text-gray-700">Manufacturer:</p>
              <p>{{ manufacturer }}</p>
            </div>
            <div>
              <p class="font-medium text-gray-700">Model:</p>
              <p>{{ applianceModel }}</p>
            </div>
            <div>
              <p class="font-medium text-gray-700">Serial Number:</p>
              <p>{{ serialNumber }}</p>
            </div>
            <div>
              <p class="font-medium text-gray-700">Purchase Location:</p>
              <p>{{ purchaseLocation }}</p>
            </div>
            <div>
              <p class="font-medium text-gray-700">Purchase Date:</p>
              <p>{{ purchaseDate }}</p>
            </div>
          </div>
          
          <div v-if="attachments.length">
            <p class="font-medium text-gray-700 mb-2">Attachments:</p>
            <ul class="list-disc list-inside">
              <li v-for="attachment in attachments" :key="attachment.id">
                {{ attachment.name }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Navigation Buttons -->
      <div class="mt-8 flex justify-between">
        <button
          v-if="currentStep > 1"
          @click="currentStep--"
          class="px-4 py-2 text-gray-600 hover:text-gray-800"
          :disabled="isProcessing"
        >
          Back
        </button>
        <div class="ml-auto flex gap-2">
          <button
            v-if="currentStep < 4"
            @click="currentStep++"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            :disabled="!canProceed || isProcessing"
          >
            Next
          </button>
          <button
            v-else
            @click="createAppliance"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            :disabled="isProcessing"
          >
            Create Appliance
          </button>
        </div>
      </div>
    </div>
  </div>
    <!-- Loading Modal -->
    <UModal v-model="isUploading">
    <div class="p-4 flex flex-col items-center">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin mb-2" />
      <p>Uploading files, please wait...</p>
    </div>
  </UModal>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { collection, addDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
const router = useRouter();
const route = useRoute();
const homeId = route.params.homeId;

const { $db, $storage } = useNuxtApp();

// State
const currentStep = ref(1);
const selectedType = ref(null);
const isOtherType = ref(false);
const otherTypeValue = ref('');
const selectedManufacturer = ref('');
const manufacturer = ref('');
const serialNumber = ref('');
const applianceModel = ref('');
const purchaseLocation = ref('');
const purchaseDate = ref('');
const notes = ref('');
const attachments = ref([]);
const isProcessing = ref(false);
const isMoreTypesOpen = ref(false);
const previewImage = ref(null);

// Refs
const photoInput = ref(null);
const attachmentsRef = ref(null);

// Steps configuration
const steps = [
  { id: 1, title: 'Type' },
  { id: 2, title: 'Details' },
  { id: 3, title: 'Purchase' },
  { id: 4, title: 'Summary' }
];

// Appliance types
const commonApplianceTypes = [
  { value: 'refrigerator', label: 'Refrigerator', icon: 'i-mdi-fridge' },
  { value: 'dishwasher', label: 'Dishwasher', icon: 'i-mdi-dishwasher' },
  { value: 'stove', label: 'Stove/Range', icon: 'i-mdi-stove' },
  { value: 'microwave', label: 'Microwave', icon: 'i-mdi-microwave' },
  { value: 'washer', label: 'Washer', icon: 'i-mdi-washing-machine' },
  { value: 'dryer', label: 'Dryer', icon: 'i-mdi-tumble-dryer' },
];

const moreApplianceTypes = [
{ value: 'air-fryer', label: 'Air Fryer', icon: 'i-mdi-toaster-oven' },
{ value: 'rice-cooker', label: 'Rice Cooker', icon: 'i-mdi-rice' }
];

// Common manufacturers list
const commonManufacturers = [
  'Whirlpool',
  'GE Appliances',
  'Samsung',
  'LG',
  'Maytag',
  'KitchenAid',
  'Frigidaire',
  'Bosch',
  'Kenmore',
  'Miele',
  'Sub-Zero',
  'Viking',
  'Electrolux',
  'Thermador',
  'Speed Queen'
];

// Computed
const canProceed = computed(() => {
  switch (currentStep.value) {
    case 1:
      return selectedType.value || (isOtherType.value && otherTypeValue.value);
    case 2:
      return manufacturer.value && serialNumber.value;
    case 3:
      return purchaseLocation.value && purchaseDate.value;
    default:
      return true;
  }
});

// Methods
const selectApplianceType = (type) => {
  selectedType.value = type;
  isOtherType.value = false;
  currentStep.value++;
};

const handlePhotoUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  previewImage.value = URL.createObjectURL(file);
};

const handleFileDeleted = (file) => {
  attachments.value = attachments.value.filter(f => f.id !== file.id);
};

const emit = defineEmits(['complete']);
const isUploading = ref(false);

const createAppliance = async () => {
  console.log('createAppliance')
  isUploading.value = true;
  console.log(attachmentsRef.value)
  // await new Promise(resolve => setTimeout(resolve, 5000));
  isProcessing.value = true;
  const user = await useCurrentUser()
  console.log(user.value)
  const updated_at_timestamp = serverTimestamp()
  const applianceId = ref('');

  try {


    
    const applianceData = {
    category: isOtherType.value ? otherTypeValue.value : selectedType.value.label,
      manufacturer: manufacturer.value,
      serialNumber: serialNumber.value,
      model: applianceModel.value,
      purchaseLocation: purchaseLocation.value,
      purchaseDate: purchaseDate.value,
      notes: notes.value,       
      createdAt: updated_at_timestamp,
        updatedAt: updated_at_timestamp,
        createdByUid: user.value.uid,
        createdByDisplayName: user.value.displayName,
        updatedByUid: user.value.uid,
        updatedByDisplayName: user.value.displayName,
        imageUrl: "https://placehold.co/60x60?text=icon",
        attachments: [],
    };

    console.log(applianceData)
  const docRef = await addDoc(collection($db, "properties", homeId, "appliances"), applianceData);
  console.log("Document written with ID: ", docRef.id);
   applianceId.value = docRef.id;

    // Now that we have created an appliance, we can upload the attachments
    const uploadPromises = attachmentsRef.value.uploadedFiles.map(async (file) => {
      const fileRef = storageRef($storage, `properties/${homeId}/appliances/${applianceId.value}/${file.name}`);
      const snapshot = await uploadBytes(fileRef, file.file);
      const url = await getDownloadURL(fileRef);

      if (file.type.startsWith('application/pdf')) {
        const thumbnailRef = storageRef($storage, `properties/${homeId}/appliances/${applianceId.value}/${file.name}-thumbnail.png`);
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
    applianceData.attachments = uploadedFileData;
    //const Ref = doc($db, 'properties', homeId, 'appliances', applianceId.value)
    await updateDoc(docRef, { 
        attachments: [...uploadedFileData]     
    }, { merge: true });






    } catch (error) {
    console.error('Error creating appliance:', error);



  } finally {
    isProcessing.value = false;
    isUploading.value = false;
        emit('complete');
  }
};

const handleManufacturerChange = () => {
  if (selectedManufacturer.value !== 'other') {
    manufacturer.value = selectedManufacturer.value;
  } else {
    manufacturer.value = '';
  }
};

const clearPhoto = () => {
  previewImage.value = null;
  if (photoInput.value) {
    photoInput.value.value = ''; // Reset file input
  }
};
</script> 