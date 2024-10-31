<template>
  <div class="splash-screen">
    <div class="spinner-wrapper">
      <svg 
        class="spinner" 
        viewBox="0 0 50 50"
        width="50"
        height="50"
      >
        <circle
          class="path"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke-width="4"
        />
      </svg>
    </div>
  </div>
</template>

<style scoped>
.splash-screen {
  background: #f2f0ee;
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 50;
}

.spinner-wrapper {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.spinner {
  animation: rotate 2s linear infinite;
}

.path {
  stroke: #e45447;
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}
</style>