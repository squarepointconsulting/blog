<template>
    <div>
      <h2 class="text-2xl mb-4">Upload PDF</h2>
      <input type="file" accept="application/pdf" @change="handleFileUpload" />
      <div v-if="uploading" class="mt-4">Uploading...</div>
      <div v-if="thumbnailUrl" class="mt-4">
        <h3 class="text-xl">Thumbnail:</h3>
        <img :src="thumbnailUrl" alt="PDF Thumbnail" class="w-32 h-auto" />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
  import { doc, updateDoc } from 'firebase/firestore';


  const { $db, $storage } = useNuxtApp();

  const uploading = ref(false);
  const thumbnailUrl = ref(null);
  
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || file.type !== 'application/pdf') {
      alert('Please upload a valid PDF file.');
      return;
    }
  
    uploading.value = true;
  
    try {
      // Upload the PDF to Firebase Storage
      const pdfStorageRef = storageRef($storage, `pdfs/${file.name}`);
      await uploadBytes(pdfStorageRef, file);
      const pdfUrl = await getDownloadURL(pdfStorageRef);
  
      // Generate a thumbnail (this requires using a server-side function or a client-side library)
      const thumbnail = await generatePdfThumbnail(file);
  
      // Upload the thumbnail to Firebase Storage
      const thumbnailStorageRef = storageRef($storage, `thumbnails/${file.name}.png`);
      await uploadBytes(thumbnailStorageRef, thumbnail);
      thumbnailUrl.value = await getDownloadURL(thumbnailStorageRef);
  
      // Save the home record with the URLs (adjust the document path as necessary)
      const homeRecordDoc = doc($db, 'homes', 'homeId'); // Replace 'homeId' with the actual home document ID
      await updateDoc(homeRecordDoc, {
        pdfUrl,
        thumbnailUrl: thumbnailUrl.value,
      });
  
      alert('PDF and thumbnail uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading the PDF.');
    } finally {
      uploading.value = false;
    }
  };
  
  // Generate a thumbnail using a PDF library (e.g., pdfjs-dist)
  import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf';

  // Set the worker source
  GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.mjs',
    import.meta.url
  ).toString();

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
  
  <style scoped>
  img {
    border-radius: 8px;
    margin-top: 8px;
  }
  </style>
