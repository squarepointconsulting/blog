<template>
  <UModal v-model="showDeleteConfirm">
    <div class="p-4">
      <h3 class="text-lg font-semibold mb-4">Confirm Delete</h3>
      <p class="mb-4">Are you sure you want to delete this file?</p>
      <div class="flex justify-end gap-4">
        <button @click="() => (showDeleteConfirm = false)" class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
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
import { ref } from 'vue';

    const showDeleteConfirm = ref(false);
    const fileToDelete = ref(null);

    const confirmDelete = (file) => {
        fileToDelete.value = file;
        showDeleteConfirm.value = true;
    };

    const handleDeleteConfirm = async (deleteFile) => {
        if (fileToDelete.value) {
            await deleteFile(fileToDelete.value);
            fileToDelete.value = null;
        }
        showDeleteConfirm.value = false;
    };

</script> 