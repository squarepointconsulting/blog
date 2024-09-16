<template>
  <main>

    <TheHero>
      <div class="title">Maximizing the value of your home</div>
      <div class="subtitle">{{ formData.name }} </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-white shadow-md rounded-lg">
    
    <!-- Left Column: Avatar and Label -->
    <div class="flex items-center space-x-4">
      <img
        class="w-16 h-16 rounded-full"
        src="https://i.pravatar.cc/150"
        alt="User Avatar"
      />
      <div>
        <h2 class="text-xl font-semibold">John Doe</h2>
        <p class="text-gray-500">Your Label Here</p>
      </div>
    </div>

    <!-- Center Column: Current Score Image -->
    <div class="flex justify-center items-center">
      <img
        class="w-24 h-24 object-cover"
        src="https://via.placeholder.com/150x150?text=Score:90"
        alt="Current Score"
      />
    </div>

    <!-- Right Column: Score Trend Chart and Asset Value -->
    <div class="flex flex-col items-center justify-center">
      <canvas ref="chartCanvas" class="w-full h-32"></canvas>
      <p class="mt-4 text-lg font-semibold">
        Current Asset Value: $1,230
      </p>
    </div>
  </div>


      <div class="profile-container">
        <!-- Avatar Section -->
        <UAvatar src="https://photos.zillowstatic.com/fp/998244c38c42954e637ea8b153cb9c7c-cc_ft_576.jpg" alt="Avatar"
          size="3xl" /> &nbsp;
        <!-- Edit Button -->
        <UButton color="primary" @click="isEditing = true" icon="i-heroicons-pencil-square" />




        <!-- Information Section -->
        <div class="info-section">
          <h2></h2>
          <p>Email: {{ formData.email }}</p>
          <p>Phone: {{ formData.phone }}</p>


        </div>

        <!-- Edit Form (Shown when editing is enabled) -->
        <UModal v-model="isEditing">
          <UCard>
            <template #header>
              <h3>Edit Profile</h3>
            </template>
            <template class="h-32">
              <UInput label="Name" v-model="formData.name" placeholder="Enter your name" />
              <UInput label="Email" v-model="formData.email" placeholder="Enter your email" />
              <UInput label="Phone" v-model="formData.phone" placeholder="Enter your phone number" />
            </template>
            <template #footer>
              <UButton color="red" @click="isEditing = false">
                Cancel
              </UButton>&nbsp;
              <UButton color="primary" @click="saveChanges">
                Save Changes
              </UButton>
            </template>
          </UCard>
        </UModal>
      </div>
      <BlogPostList />
    </TheHero>


  </main>


</template>

<script setup>
import { ref } from 'vue'
//   <--! BlogPostList -->
const isEditing = ref(false)

const formData = ref({
  name: '1973 NW Hill Point Dr',
  email: 'john.doe@example.com',
  phone: '+1234567890',
})

const saveChanges = () => {
  isEditing.value = false
  // Here, you can add any logic for saving the data to a server
  console.log('Updated profile data:', formData.value)
}
</script>