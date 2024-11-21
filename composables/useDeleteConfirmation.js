import { ref } from 'vue';

export function useDeleteConfirmation() {
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

    return {
        showDeleteConfirm,
        confirmDelete,
        handleDeleteConfirm,
        fileToDelete,
    };
}