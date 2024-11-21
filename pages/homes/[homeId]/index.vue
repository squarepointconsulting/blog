<script setup>
import { useRoute } from 'vue-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import Attachments from '@/components/common/Attachments.vue';
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';


const route = useRoute();
const homeIdRef = useState('homeId') 
const homeId = route.params.homeId;
homeIdRef.value = homeId;

const { $db, $storage } = useNuxtApp();
const docRef = doc($db, 'properties', homeId);
const home = useDocument(docRef)


const attachmentsRef = ref(null);

const logUploadedFiles = async () => {
    if (attachmentsRef.value) {
        console.log(attachmentsRef.value.uploadedFiles); // Access the uploadedFiles ref
    }

    try {
    // Create an array of promises for file uploads
    const uploadPromises = attachmentsRef.value.uploadedFiles.map(async (file) => {
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
    home.value.roof.files = [...home.value.roof.files, ...uploadedFileData];
    const docRef = doc($db, "properties", homeId);
    await updateDoc(docRef, {
      roof: {
        ...home.value.roof
      },
    }, { merge: true });

  } catch (error) {
    console.error('Error in submitForm:', error);
  } finally {
    attachmentsRef.value.uploadedFiles = [];
    //isUploading.value = false;

  }



    
};


const deleteFile = async (file) => {
  try {
    console.log(`DELETEING: properties/${homeId}/${file.name}`)
    // Delete file from Storage
    const fileRef = storageRef($storage, `properties/${homeId}/${file.name}`);
    
    try {
      await deleteObject(fileRef);
    }
   catch (error) {
    console.error('Error deleting file:', error);
  }

    // If it's a PDF, also delete the thumbnail
    if (file.type.startsWith('application/pdf')) {
      const thumbnailRef = storageRef($storage, `properties/${homeId}/${file.name}-thumbnail.png`);
      await deleteObject(thumbnailRef);
    }

    home.value.roof.files = home.value.roof.files.filter(f => f.url !== file.url);
    const docRef = doc($db, "properties", homeId);
    await updateDoc(docRef, {
      roof: {
        ...home.value.roof
      },
    });

  } catch (error) {
    console.error('Error deleting file:', error);
  }
};



</script>

<template>
  <div v-if="home" class="space-y-4">
    <article v-if="home" class="p-4 bg-white shadow-md rounded-md">
      <div class="flex w-full">
        <!-- Inner Div 1 -->
        <div class="flex-1 flex flex-col justify-center items-center">
          <div class="w-full flex justify-center items-center">

            <img class="w-24 h-24 rounded-full object-fill" style="text-align: center;" :src="home.imageUrl"
              alt="{{ home.address.street1 }}" />

          </div>
          <!-- Row 2 -->
          <div class="w-full flex justify-center items-center p-1">
            <p class="">{{ home.address.street1 }}</p>
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
              <GaugeChart :villaFactScore="Math.round(home.villaFactScore)"/>
            </div>
          </div>
          <!-- Row 2 -->
          <div class="w-full flex justify-center items-center">
            <p class="font-bold text-center">{{ Math.round(home.villaFactScore) }}</p>
          </div>
        </div>
        <!-- Edit Button -->
        <div class="relative top-2 right-2">
          <NuxtLink :to="{ name: 'homes-homeId-edit', params: { homeId: homeId } }">
            <p>
              <UIcon name="i-heroicons-pencil-square" />&nbsp;Edit
            </p>
          </NuxtLink>
        </div>

      </div>
    </article>

    <HomeValue :homeId="homeId" />

    <article class="p-4 bg-white shadow-md rounded-md">
      
        <h2 class="text-lg font-bold"><UIcon name="i-heroicons-chevron-double-right" class="w-4 h-4" />
          Attachments          
        </h2>
        <CommonAttachments ref="attachmentsRef" :attachments="home.roof.files" @fileDeleted="deleteFile" />
        <button @click="logUploadedFiles">Save Files</button>
    </article>

    <article class="p-4 bg-white shadow-md rounded-md">
      <NuxtLink :to="{ name: 'homes-homeId-score', params: { homeId: homeId } }">
        <h2 class="text-lg font-bold">Level Up
          <UIcon name="i-heroicons-chevron-double-right" class="w-4 h-4" />
        </h2>
        <p class="text-gray-700">Increase your home's VillaFact Score to increase your net asset value. Complete these
          simple
          activities to build your profile.</p>
      </NuxtLink>
    </article>
    <article class="p-4 bg-white shadow-md rounded-md">
      <NuxtLink to="/invest">
        <h2 class="text-lg font-bold">Invest
          <UIcon name="i-heroicons-chevron-double-right" class="w-4 h-4" />
        </h2>
        <p class="text-gray-700">Plan and track home improvement projects to maximize your costs basis.</p>
      </NuxtLink>
    </article>
    <article class="p-4 bg-white shadow-md rounded-md">
      <NuxtLink to="/advice">
        <h2 class="text-lg font-bold">Advice
          <UIcon name="i-heroicons-chevron-double-right" class="w-4 h-4" />
        </h2>
        <p class="text-gray-700">GenAI Powered advice for homeowners about the best way to increase the value and lower
          the costs of your home.</p>
      </NuxtLink>
    </article>
  </div>
  <div v-else class="space-y-4">
    <article class="p-4 bg-white shadow-md rounded-md">
      <p>Home not found ...</p>
    </article>
  </div>
</template>

<style scoped>
.chart-container {
  height: 100px;
}
</style>