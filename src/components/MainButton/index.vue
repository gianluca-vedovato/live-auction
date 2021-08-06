<template>
  <div :class="{ 'opacity-50 pointer-events-none': status === 'disabled' }">
    <div class="cursor-pointer transition-all duration-400 hover:opacity-70 py-4 px-10 rounded-xl" :class="{ 'bg-gray-300 text-black': type === 'secondary', 'bg-blue-500 text-white': type === 'main' }">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: () => 'main'
    },
    status: {
      type: String,
      dafult: () => 'active',
      validator: value => ['active', 'disabled']
    }
  }
}
</script>
