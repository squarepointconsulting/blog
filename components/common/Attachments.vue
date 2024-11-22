<template>
    <div v-if="attachments" class="flex flex-col">
        <UCarousel v-slot="{ item }" :items="attachments" indicators="true">
            <div class="relative group">
                <video v-if="isVideo(item)" width="300" height="400" draggable="false" controls class="rounded">
                    <source :src="item.preview" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <img v-else width="300" height="400" draggable="false" :src="item.preview" :alt="item.name"
                    class="rounded" />
                <div
                    class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-4">
                    <a :href="item.url" target="_blank"
                        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
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
    <div class="flex flex-col">
        <input type="file" ref="fileInput" multiple @change="handleFileUpload" id="files" class="hidden" />
        <button @click="$refs.fileInput.click()"
            class="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition duration-200 flex items-center justify-center"
            aria-label="Choose Files">
            <UIcon name="i-heroicons-plus" class="w-5 h-5" aria-hidden="true" />
        </button>
        <!-- Display uploaded files in a carousel -->
        <div v-if="uploadedFiles.length > 0" class="mt-6">
            <h3 class="text-xl font-semibold mb-4">Pending Upload</h3>
            <UCarousel v-slot="{ item }" :items="uploadedFiles">
                <video width="300" height="400" draggable="false" v-if="isVideo(item)" controls class="rounded">
                    <source :src="item.preview" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <img width="300" height="400" draggable="false" v-else :src="item.preview" :alt="item.name"
                    class="rounded" />
            </UCarousel>
        </div>
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

<script setup>

import { ref, defineProps, defineEmits } from 'vue';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf';

const emit = defineEmits(['fileDeleted']); // Define the event


GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.mjs',
    import.meta.url
).toString();

const props = defineProps({
    attachments: {
        type: Array,
        required: true
    }
});

const showDeleteConfirm = ref(false);
const fileToDelete = ref(null);
const uploadedFiles = ref([]);

defineExpose({
    uploadedFiles
});


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

const deleteFile = async (file) => {
    emit('fileDeleted', file); // Pass the deleted file as payload
};

const confirmDelete = (file) => {
  fileToDelete.value = file;
  showDeleteConfirm.value = true;
};

const handleDeleteConfirm = async () => {
  if (fileToDelete.value) {
    await deleteFile(fileToDelete.value);
    fileToDelete.value = null;
  }
  showDeleteConfirm.value = false;
};
</script>