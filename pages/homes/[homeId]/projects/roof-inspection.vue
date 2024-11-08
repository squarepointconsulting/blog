<script setup>

import { useRoute } from 'vue-router';
const route = useRoute();
const homeId = route.params.homeId;
const project_type = ref("roof_inspection")

</script>

<template>
    <article class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <!-- Header Section -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div class="lg:col-span-2">
                <h1 class="text-4xl font-bold text-gray-900 mb-4">
                    Complete Guide to Annual Roof Inspection
                </h1>
                <p class="text-xl text-gray-600 leading-relaxed">
                    Regular roof inspections are essential for maintaining the integrity of your home. An annual
                    inspection can help identify potential issues before they become costly repairs. This guide will
                    walk you through the key areas to inspect during your annual roof inspection.
                </p>
            </div>
            <div class="lg:col-span-1">
                <img src="/images/roof-inspection.jpg" alt="Roof Inspection"
                    class="rounded-lg shadow-lg w-full h-64 object-cover" />
            </div>
        </div>

        <!-- Steps Section -->
        <section class="space-y-12">
            <!-- Roof Inspection -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 class="text-2xl font-semibold text-gray-900 mb-4">
                        1. Roof Inspection
                    </h2>
                    <p class="text-gray-600 mb-4">
                        Before you begin your inspection, ensure you have the right safety equipment, including a sturdy
                        ladder, safety harness, and non-slip shoes.
                    </p>
                    <img src="/images/ladder-safety.webp" alt="Roof Inspection"
                        class="rounded-lg shadow-lg w-full h-64 object-cover mb-4" />
                    <ul class="space-y-3 text-gray-600">
                        <li class="flex items-start">
                            <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" />
                            <span>Inspect ridges for cracks.</span>
                        </li>
                        <li class="flex items-start">
                            <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" />
                            <span>Look for missing or loose shingles.</span>
                        </li>
                        <li class="flex items-start">
                            <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" />
                            <span>Ensure shingles have enough life left; check for granules—if you see fiberglass or
                                fibers, it may be time for replacement.</span>
                        </li>
                        <li class="flex items-start">
                            <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" />
                            <span>Ensure any exposed nails, screws, and bolts (from satellites, antennae, vents, etc.)
                                are sealed with roofing silicone.</span>
                        </li>
                    </ul>
                </div>
                <div>
                    <h2 class="text-2xl font-semibold text-gray-900 mb-4">
                        2. Vents, Skylights, Solar Panels, and Other Roofing Components
                    </h2>
                    <img src="/images/solar-attic-fan.jpeg" alt="Vents and Skylights"
                        class="rounded-lg shadow-lg w-full h-64 object-cover mb-4" />
                        <ul class="space-y-3 text-gray-600">
                        <li class="flex items-start">
                            <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" />
                            <span>Inspect attic vents and vent pipe collars for cracking or damage.</span>
                        </li>
                        <li class="flex items-start">
                            <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" />
                            <span>Ensure that all components are
                                securely fastened and free from debris.</span>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Paint -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 class="text-2xl font-semibold text-gray-900 mb-4">
                        3. Paint
                    </h2>
                    <img src="public/images/exterior-trim-soffits-and-fascias-diagram-1024x683.jpg"
                        alt="Paint Inspection" class="rounded-lg shadow-lg w-full h-64 object-cover mb-4" />
                        <ul class="space-y-3 text-gray-600">
                        <li class="flex items-start">
                            <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" />
                            <span>Check fascia boards, siding, and other painted surfaces, especially those facing south and west.</span>
                        </li>
                        <li class="flex items-start">
                            <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" />
                            <span>Look for signs of cracking, peeling, and wood warping.</span>
                        </li>
                    </ul>
                </div>
                <div>
                    <h2 class="text-2xl font-semibold text-gray-900 mb-4">
                        4. Chimney
                    </h2>
                    <img src="/images/chimney-insp.jpg" alt="Chimney Inspection"
                        class="rounded-lg shadow-lg w-full h-64 object-cover mb-4" />
                        <ul class="space-y-3 text-gray-600">
                        <li class="flex items-start">
                            <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" />
                            <span>Inspect the flashing around the chimney.</span>
                        </li>
                        <li class="flex items-start">
                            <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" />
                            <span>Ensure the chimney is properly sealed or painted to
                                prevent leaks.</span>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Trees -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 class="text-2xl font-semibold text-gray-900 mb-4">
                        5. Trees
                    </h2>
                    <img src="/images/tree-inspection-1.jpg" alt="Tree Pruning"
                        class="rounded-lg shadow-lg w-full h-64 object-cover mb-4" />
                        <ul class="space-y-3 text-gray-600">
                        <li class="flex items-start">
                            <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" />
                            <span>Prune back trees that are encroaching on your home or have limbs hanging over the roof.</span>
                        </li>
                        <li class="flex items-start">
                            <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" />
                            <span>This
                                will help prevent damage from falling branches and reduce debris accumulation on the roof.</span>
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    </article>
    <ProjectRecord :homeId="homeId" :projectType="project_type" />
</template>