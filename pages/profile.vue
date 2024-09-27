<script setup>
  import { ref, useTemplateRef, computed, onMounted } from 'vue'
import { signOut } from 'firebase/auth';
import { collection, addDoc, query, getDocs } from 'firebase/firestore';
const auth = useFirebaseAuth()
const user = useCurrentUser()
const router = useRouter()
const db = useFirestore()

const newHome = ref({
  docVersion: 1.0,
  address: {
    city: "Your City",
    state: "OR",
    street1: "1919 NE Main St",
    street2: "",
    zip: "90210",
  },
  currentAppraisedValue: 1000000,
  geoip: '',
  villaFactScore: 500,
  imageUrl: false,
  ownerId: user.uid,
  updated_at: null,
})

// Add a new document with a generated id.
async function addNewHome() {
  newHome.value.ownerId = user.value.uid
  const newHomeRef =await addDoc(collection(db, "properties"), newHome.value);
}


function handleSignOut() {
  signOut(auth)
    .then(() => router.replace('/'))
}

</script>

<template>
    <!-- Blog posts list -->
    <div class="space-y-4" v-if="user">
        <article class="p-4 bg-white shadow-md rounded-md">
            <div class="flex w-full">
        <!-- Inner Div 1 -->
        <div class="flex-1 flex flex-col justify-center items-center">
          <div class="w-full flex justify-center items-center">
            <Gravatar :size="42" />
          </div>
          <!-- Row 2 -->
          <div class="w-full flex justify-center items-center p-1">
            <p class="">{{ user.displayName }}</p>
          </div>
        </div>

        <!-- Inner Div 2 -->
        <div class="flex-1 flex flex-col justify-center items-center">
          <!-- Row 1 -->
          <div class="w-full flex justify-center items-center p-4">
            <div class="">
              <span><UButton @click="addNewHome">New Home</UButton></span>
            </div>
          </div>
          <!-- Row 2 -->

          <div class="w-full flex justify-center items-center">
            <span v-if="user"><UButton @click="handleSignOut">Log Out</UButton>
            </span>
          </div>
        </div>
      </div>
        </article>
        <HomeList />
        <!-- Add more blog posts as needed -->
    </div>
</template>