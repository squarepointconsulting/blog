<script setup>
import { signOut } from 'firebase/auth';
const auth = useFirebaseAuth()
const user = useCurrentUser()
const router = useRouter()

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
          <div class="w-full flex justify-center items-center">
            <div class="">
              <p>&nbsp;</p>
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
        <article class="p-4 bg-white shadow-md rounded-md">
            <h2 class="text-lg font-bold">Home Card 1</h2>
            <p class="text-gray-700">1973 NW Hill Point Drive </p>
        </article>
        <!-- Add more blog posts as needed -->
    </div>
</template>