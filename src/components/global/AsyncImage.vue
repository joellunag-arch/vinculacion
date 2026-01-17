<template>
  <div class="async-image-container" :class="{ loading: isLoading }">
    <img
      v-if="srcUrl"
      :src="srcUrl"
      :alt="alt"
      class="async-img"
      :class="imgClass"
    />
    <div v-if="isLoading" class="placeholder shimmer"></div>
  </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue';

export default {
  name: 'AsyncImage',
  props: {
    resolver: {
      type: Function,
      required: false
    },
    alt: {
      type: String,
      default: ''
    },
    imgClass: {
        type: String,
        default: ''
    }
  },
  setup(props) {
    const srcUrl = ref('');
    const isLoading = ref(true);

    const loadImage = async () => {
      isLoading.value = true;
      srcUrl.value = '';
      
      if (typeof props.resolver === 'function') {
        try {
          const url = await props.resolver();
          srcUrl.value = url;
        } catch (e) {
          console.error("Failed to load image", e);
        }
      } else if (typeof props.resolver === 'string') {
          // Si por alguna razón llega un string directo
          srcUrl.value = props.resolver;
      }
      
      isLoading.value = false;
    };

    onMounted(loadImage);

    watch(() => props.resolver, loadImage);

    return { srcUrl, isLoading };
  }
}
</script>

<style scoped>
.async-image-container {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
}

.async-image-container .async-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.placeholder {
    width: 100%;
    height: 100%;
    background: #f0f0f0;
    position: absolute;
    top: 0;
    left: 0;
}

.shimmer {
  background: linear-gradient(to right, #f0f0f0 0%, #f8f8f8 50%, #f0f0f0 100%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
</style>
