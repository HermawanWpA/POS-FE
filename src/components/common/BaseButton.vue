<template>
  <button
    :type="type"
    :disabled="loading"
    class="w-full flex justify-center items-center font-semibold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
    :class="variantClasses"
  >
    <slot v-if="!loading"></slot>
    <span v-else class="text-sm">Memproses...</span>
  </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  type: { type: String, default: 'button' },
  loading: { type: Boolean, default: false },
  variant: { type: String, default: 'primary' }
});

const variantClasses = computed(() => {
  if (props.variant === 'success') return 'bg-green-600 hover:bg-green-700 text-white';
  return 'bg-blue-600 hover:bg-blue-700 text-white';
});
</script>