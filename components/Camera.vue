Ca<template>
  <div class="wrapper">
    <video class="video" :class="facingMode === 'user' ? 'front' : ''" ref="video" />
    <canvas style="display: none" ref="canva" />

    <button v-if="videoDevices.length > 1" class="button is-rounded is-outlined switch-button" @click="switchCamera"
      :disabled="switchingCamera">
      <UIcon name="i-heroicons-sync-alt" class="w-8 h-8" />
    </button>
    <div class="photo-button-container">
      <button class="button photo-button" @click="TakePhoto">
        <UIcon name="i-heroicons-camera" class="w-8 h-8" />
      </button>
    </div>
    <photos-gallery class="gallery" :photos="photos" />
  </div>
</template>

<script>
import PhotosGallery from "./PhotosGallery.vue";
import { getStorage, ref, uploadBytes } from "firebase/storage";


function dataURLToBlob(dataURL) {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new Blob([u8arr], { type: mime });
}

async function uploadImageToFirebase(dataURL) {
  try {
    console.log("In function: uploadImageToFirebase")
    // Convert the Data URL to a Blob
    const blob = dataURLToBlob(dataURL);
    const { $storage } = useNuxtApp();
    const storageRef = ref($storage, 'images/' + Date.now() + '.png'); // Adjust the path and filename as needed
    uploadBytes(storageRef, blob).then((snapshot) => {
      console.log('Uploaded a blob or file!');
    });
    console.log(storageRef)
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}



export default {
  components: {
    PhotosGallery,
  },
  data() {
    return {
      photos: [],
      mediaStream: null,
      videoDevices: [],
      facingMode: "environment",
      counter: 0,
      switchingCamera: false,
    };
  },
  methods: {
    async StartRecording(facingMode) {
      this.facingMode = facingMode;
      let video = this.$refs.video;
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode },
      });
      video.srcObject = this.mediaStream;
      return await video.play();
    },
    async TakePhoto() {
      let video = this.$refs.video;
      let canva = this.$refs.canva;
      let width = video.videoWidth;
      let height = video.videoHeight;
      canva.width = width;
      canva.height = height;
      let ctx = canva.getContext("2d");
      ctx.save();

      if (this.facingMode === "user") {
        ctx.scale(-1, 1);
        ctx.drawImage(video, width * -1, 0, width, height);
      } else {
        ctx.drawImage(video, 0, 0);
      }

      ctx.restore();

      console.log("Smile...")
      const dataURL = canva.toDataURL("image/png")
      this.photos.push({
        id: this.counter++,
        src: dataURL,
      });


      try {
        // CKE TODO: Uploads to cloud storage are working! 
        // Good enough for now. Just needed to prove that point. 
        // Uncomment the following line to renenable:
        //const imageUrl = await uploadImageToFirebase(dataURL);
        console.log('Image uploaded successfully!');
      } catch (error) {
        console.error('Error uploading image:', error);
      }

    },
    async switchCamera() {
      this.switchingCamera = true;
      const tracks = this.mediaStream.getVideoTracks();
      tracks.forEach((track) => {
        track.stop();
      });
      await this.StartRecording(
        this.facingMode === "environment" ? "user" : "environment"
      );
      this.switchingCamera = false;
    },
  },
  async mounted() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    this.videoDevices = devices.filter((d) => d.kind === "videoinput");
    await this.StartRecording(
      this.videoDevices.length === 1 ? "user" : "environment"
    );
  },
};
</script>

<style scoped>
.video.front {
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
}

.wrapper {
  background-color: black;
  display: grid;
  width: 100vw;
  height: 100vh;
  grid-template-columns: [left] 90vw [bs] 5vw [es] 5vw [right];
  grid-template-rows: [top] 5vh [bs] 5vh [es] 60vh [middle] 10vh [bottom] 20vh [end];
  justify-items: center;
  overflow: hidden;
}

.video {
  height: 100%;
  grid-column: left/right;
  grid-row: top / bottom;
  user-select: none;
  max-width: unset;
}

.switch-button {
  grid-column: bs / es;
  grid-row: bs / es;
  z-index: 5;
  border-radius: 100%;
  width: 6vh;
  height: 6vh;
  font-size: 2vh;
}

.photo-button-container {
  grid-column: left / right;
  grid-row: middle / bottom;
  z-index: 5;
  width: 100vw;
  height: 10vh;
  display: flex;
  justify-content: center;
}

.photo-button {
  width: 10vh;
  height: 10vh;
  border-radius: 100%;
}

.photo-button {
  font-size: 4vh;
  color: black;
}

.gallery {
  grid-column: left / right;
  grid-row: bottom / end;
}
</style>