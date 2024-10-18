<template>
  <div>
    <h2 class="text-2xl mb-4">Upload PDF</h2>
    <input type="file" accept="application/pdf" @change="handleFileUpload" />
    <div v-if="uploading" class="mt-4">Uploading...</div>
    <div v-if="localThumbnailUrl" class="mt-4">
      <h3 class="text-xl">Thumbnail Preview:</h3>
      <img :src="localThumbnailUrl" alt="PDF Thumbnail" class="w-32 h-auto" />
    </div>
    <button @click="uploadToFirebase" :disabled="!localThumbnailUrl" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
      Upload to Firebase
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf';

const { $db, $storage } = useNuxtApp();

const uploading = ref(false);
const localThumbnailUrl = ref(null);
const pdfFile = ref(null);
const thumbnailBlob = ref(null);

// Set the worker source
GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString();

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file || file.type !== 'application/pdf') {
    alert('Please upload a valid PDF file.');
    return;
  }

  pdfFile.value = file;

  try {
    // Generate a thumbnail
    thumbnailBlob.value = await generatePdfThumbnail(file);
    
    // Create a local URL for the thumbnail
    localThumbnailUrl.value = URL.createObjectURL(thumbnailBlob.value);
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    alert('Error generating thumbnail.');
  }
};

const generatePdfThumbnail = async (file) => {
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
};

const uploadToFirebase = async () => {
  if (!pdfFile.value || !thumbnailBlob.value) {
    alert('Please select a PDF file first.');
    return;
  }

  uploading.value = true;

  try {
    // Upload the PDF to Firebase Storage
    const pdfStorageRef = storageRef($storage, `pdfs/${pdfFile.value.name}`);
    await uploadBytes(pdfStorageRef, pdfFile.value);
    const pdfUrl = await getDownloadURL(pdfStorageRef);

    // Upload the thumbnail to Firebase Storage
    const thumbnailStorageRef = storageRef($storage, `thumbnails/${pdfFile.value.name}.png`);
    await uploadBytes(thumbnailStorageRef, thumbnailBlob.value);
    const thumbnailUrl = await getDownloadURL(thumbnailStorageRef);

    // Save the home record with the URLs (adjust the document path as necessary)
    const homeRecordDoc = doc($db, 'homes', 'homeId'); // Replace 'homeId' with the actual home document ID
    await updateDoc(homeRecordDoc, {
      pdfUrl,
      thumbnailUrl,
    });

    alert('PDF and thumbnail uploaded successfully!');
  } catch (error) {
    console.error('Error uploading file:', error);
    alert('Error uploading the PDF.');
  } finally {
    uploading.value = false;
  }
};
</script>

<style scoped>
img {
  border-radius: 8px;
  margin-top: 8px;
}
</style>
