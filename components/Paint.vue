<script setup>

import { useRoute } from 'vue-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
const route = useRoute();
const homeId = route.params.id;
const { $db, $storage } = useNuxtApp();
const homeSource = ref()

onMounted(() => {
  const docRef = doc($db, "properties", homeId);
  getDoc(docRef).then((docSnap) => {
    if (docSnap.exists()) {
      homeSource.value = docSnap.data()
      if (!homeSource.value.paint) {
        homeSource.value.paint = {
          squareFeet: '',
          materials: '',
          dateInstalled: '',
          installer: '',
          price: '',
          notes: '',
          files: [],
        };
      }
      paint.value = {
        ...homeSource.value.paint
      }
    }
  })
})


const paint = ref({
  squareFeet: '',
  materials: '',
  dateInstalled: '',
  installer: '',
  price: '',
  notes: '',
  files: [],
});

const uploadedFiles = ref([]);
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

const submitForm = async () => {
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

    // Add uploaded file data to the paint
    paint.value.files = [...paint.value.files, ...uploadedFileData];

    // Update the home document in Firestore
    const docRef = doc($db, "properties", homeId);
    await updateDoc(docRef, {
      paint: {
        ...paint.value
      },
    }, { merge: true });

  } catch (error) {
    console.error('Error in submitForm:', error);
  } finally {

  }
};

// Generate a thumbnail using a PDF library (e.g., pdfjs-dist)
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf';

// Set the worker source
GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString();

const uploading = ref(false);
const localThumbnailUrl = ref(null);
const pdfFile = ref(null);
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





</script>

<template>

  <div v-if="homeSource" class="max-w-4xl mx-auto p-4">
    <form @submit.prevent="submitForm" class="max-w-4xl mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="flex flex-col">
          <label for="squareFeet" class="mb-1">Square Feet:</label>
          <input type="number" v-model="paint.squareFeet" id="squareFeet" class="border rounded p-2"
            placeholder="Enter square feet" />
        </div>
        <div class="flex flex-col">
          <label for="materials" class="mb-1">Materials:</label>
          <input type="text" v-model="paint.materials" id="materials" class="border rounded p-2"
            placeholder="Enter materials" />
        </div>
        <div class="flex flex-col">
          <label for="dateInstalled" class="mb-1">Date Installed:</label>
          <input type="date" v-model="paint.dateInstalled" id="dateInstalled" class="border rounded p-2" />
        </div>
        <div class="flex flex-col">
          <label for="installer" class="mb-1">Installer:</label>
          <input type="text" v-model="paint.installer" id="installer" class="border rounded p-2"
            placeholder="Enter installer name" />
        </div>
        <div class="flex flex-col">
          <label for="price" class="mb-1">Price Paid:</label>
          <input type="number" v-model="paint.price" id="price" class="border rounded p-2" placeholder="Enter price" />
        </div>
        <div class="flex flex-col md:col-span-2">
          <label for="notes" class="mb-1">Notes:</label>
          <textarea v-model="paint.notes" id="notes" class="border rounded p-2" placeholder="Enter notes"
            rows="3"></textarea>
        </div>
        <div v-if="homeSource.paint.files.length > 0" class="flex flex-col md:col-span-2">
          <UCarousel v-slot="{ item }" :items="homeSource.paint.files" indicators>
            <img width="300" height="400" draggable="false" :src="item.preview" :alt="item.name" class="rounded" />
          </UCarousel>
        </div>
        <div class="flex flex-col md:col-span-2">
          <label for="files" class="mb-1">Upload Files:</label>
          <input type="file" multiple @change="handleFileUpload" id="files" class="border rounded p-2" />
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
            Submit
          </button>
        </div>
      </div>
    </form>

  </div>


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
</style>
