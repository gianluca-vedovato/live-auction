<template>
  <div class="navigation flex justify-center w-full px-4 py-6">
    <router-link :to="{ name: 'Home' }">
      <span class="material-icons text-4xl text-gray-400 mx-6 cursor-pointer transition-all duration-200 hover:opacity-60">home</span>
    </router-link>
    <router-link :to="{ name: 'User' }">
      <span class="material-icons text-4xl text-gray-400 mx-6 cursor-pointer transition-all duration-200 hover:opacity-60">person</span>
    </router-link>
  </div>
</template>

<style lang="scss" scoped>
.router-link-exact-active {
  @apply pointer-events-none opacity-40;
}
</style>
