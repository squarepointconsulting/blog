<template>
  <main>

    <TheHero>     
      Maximizing the value of your home. <br />
      <div class="profile-container">
    <!-- Avatar Section -->
    <UAvatar
    src="https://photos.zillowstatic.com/fp/998244c38c42954e637ea8b153cb9c7c-cc_ft_576.jpg"
    alt="Avatar" size="xl"
  /> 
  <UButton
    icon="i-heroicons-pencil-square"
    size="sm"
    color="primary"
    variant="solid"
    label=""
    :trailing="false"
  />  
    
    <!-- Information Section -->
    <div class="info-section">
      <h2>{{ formData.name }}</h2>
      <p>Email: {{ formData.email }}</p>
      <p>Phone: {{ formData.phone }}</p>

      <!-- Edit Button -->
      <UButton color="primary" @click="isEditing = true">
        Edit Profile
      </UButton>
      <UButton
    icon="i-heroicons-pencil-square"
    size="sm"
    color="primary"
    variant="solid"
    label=""
    :trailing="false"
  />  
    </div>

    <!-- Edit Form (Shown when editing is enabled) -->
    <UModal v-model="isEditing">
      <template #header>
        <h3>Edit Profile</h3>
      </template>
      <template #body>
        <UInput
          label="Name"
          v-model="formData.name"
          placeholder="Enter your name"
        />
        <UInput
          label="Email"
          v-model="formData.email"
          placeholder="Enter your email"
        />
        <UInput
          label="Phone"
          v-model="formData.phone"
          placeholder="Enter your phone number"
        />
      </template>
      <template #footer>
        <UButton flat color="error" @click="isEditing = false">
          Cancel
        </UButton>
        <UButton color="primary" @click="saveChanges">
          Save Changes
        </UButton>
      </template>
    </UModal>
  </div>      
      
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