<template>
  <div>
    <Button
      v-if="showButton"
      icon="pi pi-trash"
      label="Delete"
      size="small"
      severity="danger"
      text
      fluid
      @click="dialogVisible = true"
    />

    <Dialog
      v-model:visible="dialogVisible"
      modal
      header="Delete Holding"
      :style="{ width: '25rem' }"
      :pt="{
        header: {
          class: 'p-5',
        },
        title: {
          class: 'text-lg',
        },
      }"
    >
      <div>
        <p class="flex items-center text-sm gap-2">
          <i class="pi pi-exclamation-triangle text-2xl"></i>
          Are you sure you want to delete this holding?
        </p>
        <div class="flex justify-end gap-2 mt-4 col-span-2">
          <Button
            type="button"
            label="Cancel"
            severity="secondary"
            outlined
            size="small"
            icon="pi pi-times"
            :disabled="isSaving"
            @click="closeDialog"
          >
          </Button>
          <Button
            type="button"
            label="Delete"
            size="small"
            severity="danger"
            icon="pi pi-trash"
            :loading="isSaving"
            @click="deleteAsset"
          >
          </Button>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import type { FormattedHolding } from "~/types";

const { deleteHolding } = useHoldings();
const toast = useToast();
const emit = defineEmits(["refresh"]);

const props = defineProps({
  showButton: {
    type: Boolean,
    required: false,
    default: true,
  },
});

const holding = defineModel("holding", {
  type: Object as PropType<FormattedHolding>,
  required: true,
});

const isSaving = ref<boolean>(false);
const dialogVisible = ref<boolean>(false);

const closeDialog = () => {
  dialogVisible.value = false;
};

const deleteAsset = async () => {
  isSaving.value = true;

  try {
    if (holding) {
      const response = await deleteHolding(holding.value.id);

      if (response) {
        toast.add({
          severity: "success",
          summary: "Success",
          detail: "Holding deleted successfully",
          life: 5000,
        });
      }

      closeDialog();
      emit("refresh");
    }
  } catch (error: any) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: error.statusMessage || "Failed to delete holding",
      life: 5000,
    });
  } finally {
    isSaving.value = false;
  }
};

defineExpose({ dialogVisible });
</script>
