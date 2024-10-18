<script setup>

import { useRoute } from 'vue-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

import { Carousel, Slide } from 'vue3-carousel';

const route = useRoute();
const homeId = route.params.id;

const { $db, $storage } = useNuxtApp();
const docRef = doc($db, 'properties', homeId);
const home = useDocument(docRef)
const homeSource = ref()
const router = useRouter();
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
  icon: 'i-pajamas-issue-type-objective',
  content: 'Roofs and stuff'
}, {
  label: 'Interior',
  key: 'interior',
  icon: 'i-pajamas-issue-type-objective',
  content: 'Beds and Baths and stuff',
  disabled: true,
}, {
  label: 'Appliances',
  key: 'appliances',
  icon: 'i-pajamas-issue-type-objective',
  content: 'Dishwashers and refrigerators and stuff',
  disabled: true,
},]

const sections = [{
  label: 'Roof',
  icon: 'i-heroicons-information-circle',
  defaultOpen: false,
  slot: 'roof-info'
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
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
}, {
  label: 'Paint',
  icon: 'i-heroicons-rectangle-group',
  slot: 'paint',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
},]

onMounted(() => {
  const docRef = doc($db, "properties", homeId);
  getDoc(docRef).then((docSnap) => {
    if (docSnap.exists()) {
      homeSource.value = docSnap.data()
      if (!homeSource.value.roof) {
        console.log('No roof found, creating new roof');
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
      form.value = {
        ...homeSource.value.roof
      }
    } 
  })
})


const form = ref({
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
  console.log('Files selected:', files);
  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = () => {
      console.log('File processed:', file.name);
      if (file.type.startsWith('application/pdf')) {
        console.log('PDF file detected');
 
        generatePdfThumbnail(file).then((thumbnail) => {
          thumbnailBlob.value = thumbnail;
          // Create a local URL for the thumbnail
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
      console.log('Current uploadedFiles:', uploadedFiles.value);
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
      console.log('File:', file);
      const fileRef = storageRef($storage, `properties/${homeId}/${file.name}`);
      console.log('File ref:', fileRef);

      const snapshot = await uploadBytes(fileRef, file.file);
      const url = await getDownloadURL(fileRef);

      console.log('File uploaded:', url);


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

    // Add uploaded file data to the form
    form.value.files = [...form.value.files, ...uploadedFileData];

    console.log('All files uploaded');

    // Update the home document in Firestore
    const docRef = doc($db, "properties", homeId);
    await updateDoc(docRef, {
      roof: {
        ...form.value
      }
    }, { merge: true });

    console.log('Home updated successfully');
    
    // Optionally, you can reset the form or show a success message here
    
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

              <template #roof-info>

                <div v-if="homeSource" class="max-w-4xl mx-auto p-4">
                  <form @submit.prevent="submitForm" class="max-w-4xl mx-auto px-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div class="flex flex-col">
                        <label for="squareFeet" class="mb-1">Square Feet:</label>
                        <input type="number" v-model="form.squareFeet" id="squareFeet" class="border rounded p-2"
                          placeholder="Enter square feet" />
                      </div>
                      <div class="flex flex-col">
                        <label for="materials" class="mb-1">Materials:</label>
                        <input type="text" v-model="form.materials" id="materials" class="border rounded p-2"
                          placeholder="Enter materials" />
                      </div>
                      <div class="flex flex-col">
                        <label for="dateInstalled" class="mb-1">Date Installed:</label>
                        <input type="date" v-model="form.dateInstalled" id="dateInstalled" class="border rounded p-2" />
                      </div>
                      <div class="flex flex-col">
                        <label for="installer" class="mb-1">Installer:</label>
                        <input type="text" v-model="form.installer" id="installer" class="border rounded p-2"
                          placeholder="Enter installer name" />
                      </div>
                      <div class="flex flex-col">
                        <label for="price" class="mb-1">Price Paid:</label>
                        <input type="number" v-model="form.price" id="price" class="border rounded p-2"
                          placeholder="Enter price" />
                      </div>
                      <div v-if="homeSource.roof.files.length > 0" class="flex flex-col md:col-span-2">
                        <UCarousel v-slot="{ item }" :items="homeSource.roof.files" indicators>                   
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
                              <img width="300" height="400" draggable="false" v-else :src="item.preview" :alt="item.name" class="rounded" />                              
                          </UCarousel>
                        </div>
                      </div>
                      <div class="flex flex-col md:col-span-2">
                        <label for="notes" class="mb-1">Notes:</label>
                        <textarea v-model="form.notes" id="notes" class="border rounded p-2" placeholder="Enter notes"
                          rows="3"></textarea>
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

              <template #gutters>
                <article v-if="homeSource" class="p-4 bg-white shadow-md rounded-md relative">
                  <div class="max-w-4xl mx-auto p-4">
                    <h2 class="text-2xl font-bold mb-4">Enter Roof Information</h2>
                    <form @submit.prevent="submitForm">
                      <div class="mb-4">
                        <label for="squareFeet" class="block">Square Feet:</label>
                        <input type="number" v-model="form.squareFeet" class="border rounded w-full p-2"
                          placeholder="Enter square feet" />
                      </div>

                      <div class="mb-4">
                        <label for="materials" class="block">Materials:</label>
                        <input type="text" v-model="form.materials" class="border rounded w-full p-2"
                          placeholder="Enter materials" />
                      </div>

                      <div class="mb-4">
                        <label for="dateInstalled" class="block">Date Installed:</label>
                        <input type="date" v-model="form.dateInstalled" class="border rounded w-full p-2" />
                      </div>

                      <div class="mb-4">
                        <label for="installer" class="block">Installer:</label>
                        <input type="text" v-model="form.installer" class="border rounded w-full p-2"
                          placeholder="Enter installer name" />
                      </div>

                      <div class="mb-4">
                        <label for="price" class="block">Price Paid:</label>
                        <input type="number" v-model="form.price" class="border rounded w-full p-2"
                          placeholder="Enter price" />
                      </div>

                      <div class="mb-4">
                        <label for="notes" class="block">Notes:</label>
                        <textarea v-model="form.notes" class="border rounded w-full p-2" placeholder="Enter notes"
                          rows="3"></textarea>
                      </div>

                      <div class="mb-4">
                        <label for="files" class="block">Upload Files:</label>
                        <input type="file" multiple @change="handleFileUpload" class="border rounded w-full p-2" />
                      </div>

                      <button type="submit" class="bg-blue-500 text-white rounded p-2">
                        Submit
                      </button>
                    </form>

                    <!-- Display uploaded files in a carousel -->
                    <div v-if="uploadedFiles.length > 0" class="mt-6">
                      <h3 class="text-xl font-semibold mb-4">The Uploaded Files</h3>
                      <p>Number of uploaded files: {{ uploadedFiles.length }}</p>
                      <Carousel :wrapAround="false" :itemsToShow="1">
                        <Slide v-for="(file, index) in uploadedFiles" :key="index"
                          class="outline-solid outline-2 outline-blue-500">
                          <p>File: {{ file.name }} ({{ file.type }})</p>
                          <img v-if="isImage(file)" :src="file.preview" :alt="file.name" class="w-full rounded" />
                          <video v-else-if="isVideo(file)" controls class="w-full rounded">
                            <source :src="file.preview" type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                          <a v-else :href="file.preview" target="_blank" class="text-blue-500 underline">
                            {{ file.name }}
                          </a>
                        </Slide>
                      </Carousel>
                    </div>
                  </div>
                </article>
              </template>

              <template #siding>
                <article v-if="homeSource" class="p-4 bg-white shadow-md rounded-md relative">
                  <div class="max-w-4xl mx-auto p-4">
                    <h2 class="text-2xl font-bold mb-4">Enter Roof Information</h2>
                    <form @submit.prevent="submitForm">
                      <div class="mb-4">
                        <label for="squareFeet" class="block">Square Feet:</label>
                        <input type="number" v-model="form.squareFeet" class="border rounded w-full p-2"
                          placeholder="Enter square feet" />
                      </div>

                      <div class="mb-4">
                        <label for="materials" class="block">Materials:</label>
                        <input type="text" v-model="form.materials" class="border rounded w-full p-2"
                          placeholder="Enter materials" />
                      </div>

                      <div class="mb-4">
                        <label for="dateInstalled" class="block">Date Installed:</label>
                        <input type="date" v-model="form.dateInstalled" class="border rounded w-full p-2" />
                      </div>

                      <div class="mb-4">
                        <label for="installer" class="block">Installer:</label>
                        <input type="text" v-model="form.installer" class="border rounded w-full p-2"
                          placeholder="Enter installer name" />
                      </div>

                      <div class="mb-4">
                        <label for="price" class="block">Price Paid:</label>
                        <input type="number" v-model="form.price" class="border rounded w-full p-2"
                          placeholder="Enter price" />
                      </div>

                      <div class="mb-4">
                        <label for="notes" class="block">Notes:</label>
                        <textarea v-model="form.notes" class="border rounded w-full p-2" placeholder="Enter notes"
                          rows="3"></textarea>
                      </div>

                      <div class="mb-4">
                        <label for="files" class="block">Upload Files:</label>
                        <input type="file" multiple @change="handleFileUpload" class="border rounded w-full p-2" />
                      </div>

                      <button type="submit" class="bg-blue-500 text-white rounded p-2">
                        Submit
                      </button>
                    </form>

                    <!-- Display uploaded files in a carousel -->
                    <div v-if="uploadedFiles.length > 0" class="mt-6">
                      <h3 class="text-xl font-semibold mb-4">The Uploaded Files</h3>
                      <p>Number of uploaded files: {{ uploadedFiles.length }}</p>
                      <Carousel :wrapAround="false" :itemsToShow="1">
                        <Slide v-for="(file, index) in uploadedFiles" :key="index"
                          class="outline-solid outline-2 outline-blue-500">
                          <p>File: {{ file.name }} ({{ file.type }})</p>
                          <img v-if="isImage(file)" :src="file.preview" :alt="file.name" class="w-full rounded" />
                          <video v-else-if="isVideo(file)" controls class="w-full rounded">
                            <source :src="file.preview" type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                          <a v-else :href="file.preview" target="_blank" class="text-blue-500 underline">
                            {{ file.name }}
                          </a>
                        </Slide>
                      </Carousel>
                    </div>
                  </div>
                </article>
              </template>

              <template #paint>
                <article v-if="homeSource" class="p-4 bg-white shadow-md rounded-md relative">
                  <div class="max-w-4xl mx-auto p-4">
                    <h2 class="text-2xl font-bold mb-4">Enter Roof Information</h2>
                    <form @submit.prevent="submitForm">
                      <div class="mb-4">
                        <label for="squareFeet" class="block">Square Feet:</label>
                        <input type="number" v-model="form.squareFeet" class="border rounded w-full p-2"
                          placeholder="Enter square feet" />
                      </div>

                      <div class="mb-4">
                        <label for="materials" class="block">Materials:</label>
                        <input type="text" v-model="form.materials" class="border rounded w-full p-2"
                          placeholder="Enter materials" />
                      </div>

                      <div class="mb-4">
                        <label for="dateInstalled" class="block">Date Installed:</label>
                        <input type="date" v-model="form.dateInstalled" class="border rounded w-full p-2" />
                      </div>

                      <div class="mb-4">
                        <label for="installer" class="block">Installer:</label>
                        <input type="text" v-model="form.installer" class="border rounded w-full p-2"
                          placeholder="Enter installer name" />
                      </div>

                      <div class="mb-4">
                        <label for="price" class="block">Price Paid:</label>
                        <input type="number" v-model="form.price" class="border rounded w-full p-2"
                          placeholder="Enter price" />
                      </div>

                      <div class="mb-4">
                        <label for="notes" class="block">Notes:</label>
                        <textarea v-model="form.notes" class="border rounded w-full p-2" placeholder="Enter notes"
                          rows="3"></textarea>
                      </div>

                      <div class="mb-4">
                        <label for="files" class="block">Upload Files:</label>
                        <input type="file" multiple @change="handleFileUpload" class="border rounded w-full p-2" />
                      </div>

                      <button type="submit" class="bg-blue-500 text-white rounded p-2">
                        Submit
                      </button>
                    </form>

                    <!-- Display uploaded files in a carousel -->
                    <div v-if="uploadedFiles.length > 0" class="mt-6">
                      <h3 class="text-xl font-semibold mb-4">The Uploaded Files</h3>
                      <p>Number of uploaded files: {{ uploadedFiles.length }}</p>
                      <Carousel :wrapAround="false" :itemsToShow="1">
                        <Slide v-for="(file, index) in uploadedFiles" :key="index"
                          class="outline-solid outline-2 outline-blue-500">
                          <p>File: {{ file.name }} ({{ file.type }})</p>
                          <img v-if="isImage(file)" :src="file.preview" :alt="file.name" class="w-full rounded" />
                          <video v-else-if="isVideo(file)" controls class="w-full rounded">
                            <source :src="file.preview" type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                          <a v-else :href="file.preview" target="_blank" class="text-blue-500 underline">
                            {{ file.name }}
                          </a>
                        </Slide>
                      </Carousel>
                    </div>
                  </div>
                </article>
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

