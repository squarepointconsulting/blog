<template>
  <div class="ocr-container">
    <div v-if="!tesseractLoaded" class="loading">
      Loading Tesseract.js...
    </div>
    <div v-else>
      <input type="file" accept="image/*" @change="handleFileUpload" />
      <div v-if="imageSrc">
        <img :src="imageSrc" alt="Uploaded Image" class="preview-image" />
      </div>
      <div v-if="processing">Processing...</div>
      <div v-if="extractedText">
        <h3>Extracted Text:</h3>
        <p>{{ extractedText }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { initializeWorker, recognizeText, terminateWorker } from "@/utils/tesseractWorker";

const imageSrc = ref(null);
const extractedText = ref("");
const processing = ref(false);
const tesseractLoaded = ref(false);

const handleFileUpload = async (event) => {
  if (!tesseractLoaded.value) {
    alert('Tesseract.js is still loading. Please wait.');
    return;
  }

  const file = event.target.files[0];
  if (file) {
    try {
      imageSrc.value = URL.createObjectURL(file);
      processing.value = true;
      extractedText.value = await recognizeText(file);
    } catch (error) {
      console.error('Error processing file:', error);
      extractedText.value = 'Error occurred while processing the image.';
    } finally {
      processing.value = false;
    }
  }
};

onMounted(async () => {
  // Wait for Tesseract to be available
  const checkTesseract = setInterval(() => {
    if (window.Tesseract) {
      clearInterval(checkTesseract);
      tesseractLoaded.value = true;
      initializeWorker().catch(error => {
        console.error('Error initializing worker:', error);
      });
    }
  }, 100);

  // Cleanup interval if component unmounts before Tesseract loads
  setTimeout(() => {
    clearInterval(checkTesseract);
    if (!tesseractLoaded.value) {
      console.error('Tesseract failed to load within timeout');
    }
  }, 10000); // 10 second timeout
});

onBeforeUnmount(async () => {
  await terminateWorker();
});
</script>

<style>
.ocr-container {
  text-align: center;
}
.preview-image {
  max-width: 100%;
  margin: 20px 0;
}
.loading {
  padding: 20px;
  font-style: italic;
  color: #666;
}
</style>