<script setup>

import { useRoute } from 'vue-router';
const route = useRoute();
const homeId = route.params.homeId;
const project_type = ref("property_avatar")

</script>

<template>
    <article class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <!-- Header Section -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div class="lg:col-span-2">
                <h1 class="text-4xl font-bold text-gray-900 mb-4">
                    Getting Started with a Property Avatar
                </h1>
                <p class="text-xl text-gray-600 leading-relaxed">
                    Taking a photo of your home to create a personalized property profile helps document its unique
                    features, track improvements over time, and enhances insurance, appraisal, or resale processes by
                    providing a visual record of your property's condition and characteristics.
                </p>
            </div>
            <div class="lg:col-span-1">
                <img src="/images/property-avatar-example.jpg" alt="Gutter Maintenance"
                    class="rounded-lg shadow-lg w-full h-64 object-cover" />
            </div>
        </div>

        <!-- Steps Section -->
        <section class="space-y-12">
            <!-- Safety First -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 class="text-2xl font-semibold text-gray-900 mb-4">
                        1. Go to your Property Profile
                    </h2>
                    <ul class="space-y-3 text-gray-600">
                        <li class="flex items-start">
                            <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" />
                            <span>Open the VillaFact app</span>
                        </li>
                        <li class="flex items-start">
                            <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" />
                            <span>Choose your property from the profile page.</span>
                        </li>
                        <li class="flex items-start">
                            <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" />
                            <span>Click the placeholder image to take a new photo or upload one on your computer.</span>
                        </li>
                    </ul>
                </div>
                <div>
                    <img src="/images/ladder-safety.webp" alt="Ladder Safety"
                        class="rounded-lg shadow-lg w-full h-64 object-cover" />
                </div>
            </div>

            <!-- Initial Inspection -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="md:order-2">
                    <h2 class="text-2xl font-semibold text-gray-900 mb-4">
                        2. Confirm your new Avatar
                    </h2>
                    <ul class="space-y-3 text-gray-600">
                        <li class="flex items-start">
                            <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" />
                            <span>You should see this in the application.</span>
                        </li>
                        <li class="flex items-start">
                            <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" />
                            <span>Check here and here for more places to see it.</span>
                        </li>
                    </ul>
                </div>
                <div class="md:order-1">
                    <img src="/images/man-cleaning-gutters-16260041.webp" alt="Gutter Inspection"
                        class="rounded-lg shadow-lg w-full h-64 object-cover" />
                </div>
            </div>

            <!-- Cleaning Process -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 class="text-2xl font-semibold text-gray-900 mb-4">
                        3. Watch your ViiaFact score grow.
                    </h2>
                    <ul class="space-y-3 text-gray-600">
                        <li class="flex items-start">
                            <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" />
                            <span>See how this score is displayed.</span>
                        </li>
                        <li class="flex items-start">
                            <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" />
                            <span>More quests can get your a higher score.</span>
                        </li>
                        <li class="flex items-start">
                            <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" />
                            <span>Some points decrease over time. Others remain as long as the project is
                                completed.</span>
                        </li>
                    </ul>
                </div>
                <div>
                    <img src="/images/gutter-maintenance.jpg" alt="Gutter Cleaning"
                        class="rounded-lg shadow-lg w-full h-64 object-cover" />
                </div>
            </div>

            <!-- Final Inspection -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="md:order-2">
                    <h2 class="text-2xl font-semibold text-gray-900 mb-4">
                        4. See home this changes your home value
                    </h2>
                    <ul class="space-y-3 text-gray-600">
                        <li class="flex items-start">
                            <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" />
                            <span>Improving your VillaFact score means you are improving the value of your home.</span>
                        </li>
                        <li class="flex items-start">
                            <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" />
                            <span>Save money when listing and selling your home.</span>
                        </li>
                        <li class="flex items-start">
                            <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" />
                            <span>Ensure future home insurability</span>
                        </li>
                    </ul>
                </div>
                <div class="md:order-1 text-center">
                    <img src="/images/hands-worker-fixing-drain-scaffold-260nw-415177999.webp" alt="Gutter Inspection"
                        class="rounded-lg shadow-lg w-full h-64 object-cover" />
                </div>
            </div>
        </section>
    </article>
    <ProjectRecord :homeId="homeId" :projectType="project_type" />


</template>