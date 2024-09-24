<template>
    <!-- Blog posts list -->
    <div class="space-y-4">
        <article class="p-4 bg-white shadow-md rounded-md">
            <h2 class="text-lg font-bold">Settings</h2>
            <p class="text-gray-700">Track home improvement projects. Get ideas. Get more for you home and keep more of that money by tracking your cost basis.</p>
        </article>
        <article class="p-4 bg-white shadow-md rounded-md">
            <h2 class="text-lg font-bold">Project Bath Remodel</h2>
            <div>
    <input type="file" accept="image/*,video/*" multiple @change="handleFileChange" />
    <UButton @click="uploadFiles">Upload</UButton>
  </div>
            <p class="text-gray-700">Photos. Details. Costs. Tags. </p>
        </article>
        <!-- Add more blog posts as needed -->
    </div>
</template>


<script setup>
import { ref } from 'vue';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';

const files = ref([]);
const { $storage } = useNuxtApp();

const handleFileChange = (event) => {
  files.value = event.target.files;
};

const uploadFiles = async () => {
  try {
    const uploadedFiles = [];
    for (const file of files.value) {
      const fileRef = storageRef($storage, `uploads/${file.name}`);
      await uploadBytes(fileRef, file);
      //const downloadURL = await getDownloadURL(fileRef);
      //uploadedFiles.push(downloadURL);
    }

    // await addDoc(collection(firestore, 'uploads'), {
    //   files: uploadedFiles,
    //   createdAt: new Date()
    // });

    alert('Files uploaded successfully!');
  } catch (error) {
    console.error('Error uploading files:', error);
    alert('Failed to upload files.');
  }
};
</script>