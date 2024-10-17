<script setup>

import { useRoute } from 'vue-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { Carousel, Slide } from 'vue3-carousel';

const route = useRoute();
const homeId = route.params.id;
const { $db } = useNuxtApp();
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
  slot: 'installation'
}, {
  label: 'Siding',
  icon: 'i-heroicons-eye-dropper',
  defaultOpen: false,
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
}, {
  label: 'Paint',
  icon: 'i-heroicons-rectangle-group',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
},]

onMounted(() => {
  const docRef = doc($db, "properties", homeId);
  getDoc(docRef).then((docSnap) => {
    if (docSnap.exists()) {
      homeSource.value = docSnap.data()
      form.value = {
        ...homeSource.value.roof
      }

    } else {
      console.error("No such document!");
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

const handleFileUpload = (event) => {
  const files = Array.from(event.target.files);
  console.log('Files selected:', files);
  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = () => {
      console.log('File processed:', file.name);
      uploadedFiles.value.push({
        name: file.name,
        preview: reader.result,
        type: file.type,
      });
      console.log('Current uploadedFiles:', uploadedFiles.value);
    };
    reader.readAsDataURL(file);
  });
};

const isImage = (file) => file.type.startsWith('image/');
const isVideo = (file) => file.type.startsWith('video/');

const submitForm = async () => {
  console.log('Form submitted:', form.value);
  try {
    // Update the home document in Firestore
    const docRef = doc($db, "properties", homeId);
    await updateDoc(docRef, {
      roof: {
        ...form.value,
        files: uploadedFiles.value
      }
    });
    console.log('Home updated successfully');
    // Optionally, reset the form or show a success message
    // form.value = {
    //   squareFeet: '',
    //   materials: '',
    //   dateInstalled: '',
    //   installer: '',
    //   price: '',
    //   notes: '',
    //   files: [],
    // };
    // uploadedFiles.value = [];
  } catch (error) {
    console.error('Error updating home:', error);
    // Optionally, show an error message to the user
  }
};

watch(uploadedFiles, (newFiles) => {
  console.log('uploadedFiles changed:', newFiles);
}, { deep: true });

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
                        <Slide v-for="(file, index) in uploadedFiles" :key="index" class="outline-solid outline-2 outline-blue-500">
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

              <template #installation="{ description }">
                <div class="flex flex-col justify-center items-center gap-1 mb-4">
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                    Installation
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Install <code>@nuxt/ui</code> dependency to your project:
                  </p>
                  <p>
                    {{ description }}
                  </p>
                </div>

                <div class="flex flex-col items-center">
                  <code>$ npx nuxi@latest module add ui</code>
                </div>
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

