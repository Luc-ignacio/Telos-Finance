<template>
  <div class="p-5 flex flex-1 gap-5 min-h-screen bg-gray-100">
    <div class="w-72">
      <BaseSidebar />
    </div>

    <div class="flex flex-col gap-5 w-full max-w-7xl mx-auto">
      <div class="h-24">
        <BaseTopbar />
      </div>

      <div class="flex flex-1">
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>
