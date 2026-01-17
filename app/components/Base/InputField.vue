<template>
  <div class="flex flex-col gap-1">
    <label class="text-sm">
      {{ label }}
      <span v-if="isRequired" class="text-red-500">*</span>
    </label>

    <div>
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
const label = defineModel("label", {
  type: String,
  required: true,
});

const isRequired = defineModel("isRequired", {
  type: Boolean,
  required: false,
});
</script>
