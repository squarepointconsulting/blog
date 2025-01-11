<template>
    <div class="space-y-4">
        <article class="p-4 bg-white shadow-md rounded-md">
            <h2 class="text-lg font-bold flex items-center gap-3">
                <UButton icon="i-heroicons-arrow-left" variant="soft" color="gray" class="rounded-full h-8 w-8"
                    @click="() => router.back()" />
                New Home
            </h2>
        </article>
        <article v-if="editHome" class="p-4 bg-white shadow-md rounded-md relative">
            <div class="flex flex-col space-y-2">
                <UInput v-model="editHome.address.street1" type="text" placeholder="Street 1"
                    class="p-2 border-gray-300 rounded-md" />
                <UInput v-model="editHome.address.street2" type="text" placeholder="Street 2"
                    class="p-2  border-gray-300 rounded-md" />
                <UInput v-model="editHome.address.city" type="text" placeholder="City"
                    class="p-2 border-gray-300 rounded-md" />
                <UInput v-model="editHome.address.state" type="text" placeholder="State"
                    class="p-2 border-gray-300 rounded-md" />
                <UInput v-model="editHome.address.zip" type="text" placeholder="Zip Code"
                    class="p-2 border-gray-300 rounded-md" />
            </div>
            <div class="p-4 border-t mt-auto">
                <div class="flex justify-end gap-2">
                    <UButton color="gray" variant="soft" label="Cancel" @click="() => router.back()" />
                    <UButton color="blue" label="Save" @click="addNewHome" />
                </div>
            </div>
        </article>
    </div>
    <UModal v-model="isLoading">
        <div class="p-4 flex items-center justify-center">
            <UIcon name="i-heroicons-arrow-path" class="animate-spin" />
            <span class="ml-2">Loading...</span>
        </div>
    </UModal>

</template>

<script setup>
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
const { $db } = useNuxtApp();

const isLoading = ref(false)
const router = useRouter()
const user = useCurrentUser()

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
    villaFactScore: 500,
    imageUrl: "/images/home-placeholder.png",
    ownerId: "",
    updated_at: null,
    project_records: [],
})

const updated_at_timestamp = serverTimestamp()

const villaFactRecord = ref({
    enrolledTimestamp: updated_at_timestamp,
    completedTimestamp: updated_at_timestamp,
    type: "New Property",
    value: 500,
    change: 0,
    callToAction: "Add your new home to now to get 500 points!",
    description: "Congratulations! You've added a new home. Your home's VillaFact Score starts at 500. Improve it by completing more quests!",
    completedByUserUid: user.value.uid,
    completedByUserDisplayName: user.value.displayName,
});

const villaFactAvatarRecord = ref({
    enrolledTimestamp: updated_at_timestamp,
    completedTimestamp: null,
    type: "Avatar Quest",
    projectType: "property-avatar",
    ctaValue: "Increase your VillaFact score by 10%",
    value: 0,
    change: 0,
    callToAction: "Update your avatar to increase your score!",
    description: "",
    completedByUserUid: null,
    completedByUserDisplayName: null,
});



async function addNewHome() {
    editHome.value.ownerId = user.value.uid
    const newHomeRef = await addDoc(collection($db, "properties"), editHome.value);
    console.log("Document written with ID: ", newHomeRef.id);
    // Record the VillaFact Score
    const docRef = await addDoc(collection($db, "properties", newHomeRef.id, "villafact_records"), villaFactRecord.value);
    console.log("VillaFact Score written with ID: ", docRef.id);
    // Record the Avatar Quest
    const questRef = await addDoc(collection($db, "properties", newHomeRef.id, "villafact_records"), villaFactAvatarRecord.value);
    console.log("VillaFact Avatar Quest written with ID: ", questRef.id);
    router.push({ name: 'homes-homeId', params: { homeId: newHomeRef.id } })
}
</script>
