<template>
     <div v-if="base64 && asStyle" :class="props.class" :style="{ backgroundImage: `url('${base64}')` }">
          <slot />
     </div>
     <img v-else-if="base64" :src="base64" :class="props.class" alt="SVG"/>
</template>
<script setup lang="ts">
const props = defineProps<{ name: string; class?: string; asStyle?: boolean }>()
const base64 = useSvgBase64Loader(props.name)
</script>
