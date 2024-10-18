<script setup>

import { useRoute } from 'vue-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
const route = useRoute();
const homeId = route.params.id;
const { $db, $storage } = useNuxtApp();
const docRef = doc($db, 'properties', homeId);
const home = useDocument(docRef)
const homeSource = ref()
const isEditing = ref(false);

const editHome = ref({
  address: {
    city: "",
    state: "",
    street1: "",
    street2: "",
    zip: "",
  },
  currentAppraisedValue: 0,
  geoip: "",
  villaFactScore: 0,
  imageUrl: "",
  ownerId: "",
  updated_at: null,
  project_records: [],
})

// When homeSource is updated
watch(homeSource, (homeSource) => {
  // Update the editHome with the appropriate values
  editHome.value = {
    ...homeSource,
  }
})

async function updateHome() {
  const docRef = doc($db, "properties", props.homeId);
  await updateDoc(docRef, {
    ...editHome.value,
  })
  isEditing.value = false
}

const items = [{
  label: 'Exterior',
  key: 'exterior',
  icon: 'i-mdi-home',
  content: 'Roofs and stuff'
}, {
  label: 'Interior',
  key: 'interior',
  icon: 'i-mdi-sofa',
  content: 'Beds and Baths and stuff',
  disabled: true,
}, {
  label: 'Appliances',
  key: 'appliances',
  icon: 'i-mdi-fridge',
  content: 'Dishwashers and refrigerators and stuff',
  disabled: true,
},]

const sections = [{
  label: 'Roof',
  icon: 'i-mdi-home-outline',
  defaultOpen: false,
  slot: 'roof'
}, {
  label: 'Gutters',
  icon: 'i-heroicons-arrow-down-tray',
  defaultOpen: false,
  slot: 'gutters'
}, {
  label: 'Siding',
  icon: 'i-heroicons-eye-dropper',
  defaultOpen: false,
  slot: 'siding',
}, {
  label: 'Paint',
  icon: 'i-heroicons-rectangle-group',
  slot: 'paint',
},]

onMounted(() => {
  const docRef = doc($db, "properties", homeId);
  getDoc(docRef).then((docSnap) => {
    if (docSnap.exists()) {
      homeSource.value = docSnap.data()
      if (!homeSource.value.roof) {
        homeSource.value.roof = {
          squareFeet: '',
          materials: '',
          dateInstalled: '',
          installer: '',
          price: '',
          notes: '',
          files: [],
        };
      }
      roof.value = {
        ...homeSource.value.roof
      }
      if (!homeSource.value.gutters) {
        homeSource.value.gutters = {
          installed: false,
          length: 0,
          totalDownspouts: 0,
          materials: '',
          dateInstalled: '',
          installer: '',
          price: '',
          notes: '',
          files: [],  
        };
      }
      gutters.value = {
        ...homeSource.value.gutters
      } 
      if (!homeSource.value.siding) {
        homeSource.value.siding = {
          squareFeet: '',
          materials: '',
          dateInstalled: '',
          installer: '',
          price: '',
          notes: '',
          files: [],  
        };
      }
      siding.value = {
        ...homeSource.value.siding
      }
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

const roof = ref({
  squareFeet: '',
  materials: '',
  dateInstalled: '',
  installer: '',
  price: '',
  notes: '',
  files: [],
});

const gutters = ref({
  installed: false,
  length: 0,
  totalDownspouts: 0,
  materials: '',
  dateInstalled: '',
  installer: '',
  price: '',
  notes: '',
  files: [],
});

const siding = ref({
  squareFeet: '',
  materials: '',
  dateInstalled: '',
  installer: '',
  price: '',
  notes: '',
  files: [],
});

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

const roof_uploadedFiles = ref([]);
const gutters_uploadedFiles = ref([]);
const siding_uploadedFiles = ref([]);
const paint_uploadedFiles = ref([]);


const roof_handleFileUpload = async (event) => {
  const files = Array.from(event.target.files);
  console.log('Roof Files selected:', files);
  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = () => {
      console.log('Roof File processed:', file.name);
      if (file.type.startsWith('application/pdf')) {
        console.log('PDF file detected');
 
        generatePdfThumbnail(file).then((thumbnail) => {
          thumbnailBlob.value = thumbnail;
          // Create a local URL for the thumbnail
          localThumbnailUrl.value = URL.createObjectURL(thumbnailBlob.value);
          roof_uploadedFiles.value.push({
            name: file.name,
            preview: localThumbnailUrl.value,
            type: file.type,
            file: file,
            preview_file: thumbnail,
          });
        });
      } else {
        roof_uploadedFiles.value.push({
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

const roof_submitForm = async () => {
  try {

    // Create an array of promises for file uploads
    const uploadPromises = roof_uploadedFiles.value.map(async (file) => {
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

    // Add uploaded file data to the roof
    roof.value.files = [...roof.value.files, ...roof_uploadedFileData];

    // Update the home document in Firestore
    const docRef = doc($db, "properties", homeId);
    await updateDoc(docRef, {
      roof: {
        ...roof.value
      }, 
      // gutters: {
      //   ...gutters.value
      // }, 
      // siding: {
      //   ...siding.value
      // }, 
      // paint: {
      //   ...paint.value
      // },   
    }, { merge: true });

    console.log('Home updated successfully');
    
    // Optionally, you can reset the roof or show a success message here
    
  } catch (error) {
    console.error('Error in submitForm:', error);
    // Handle the error (e.g., show an error message to the user)
  } finally {
    // wait_for_files_to_upload.value = false;
  }
};

// DEBUG CODE
// watch(uploadedFiles, (newFiles) => {
//   console.log('uploadedFiles changed:', newFiles);
// }, { deep: true });


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
  <div v-if="home" class="space-y-4">
    <HomeSummary :homeId="homeId" />
    <article class="p-4 bg-white shadow-md rounded-md">

      <UTabs :items="items" class="w-full">
        <template #item="{ item }">
          <div v-if="item.key === 'exterior'" class="space-y-3">
            <UAccordion :items="sections" color="gray">
              <template #item="{ item }">
                <p class="italic text-gray-900 dark:text-white text-center">
                  {{ item.description }}
                </p>
              </template>

              <template #roof>
                <Roof />

              </template>

              <template #gutters>
                <Gutters />
              </template>

              <template #siding>
                <Siding />
              </template>

              <template #paint>
                <Paint /> 
              </template>

            </UAccordion>
          </div>
        </template>
      </UTabs>

    </article>
  </div>
  <div v-else class="space-y-4">
    <article class="p-4 bg-white shadow-md rounded-md">
      <p>Home not found ...</p>
    </article>
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

