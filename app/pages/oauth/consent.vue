<template>
  <div
    class="bg-[url(~/assets/images/b3-sign.png)] bg-neutral-900 bg-cover bg-right bg-no-repeat flex w-screen h-screen"
  >
    <div class="w-[50%] h-screen flex items-center justify-center">
      <div
        class="bg-white/80 w-[30rem] min-h-[30rem] rounded-2xl px-10 flex items-center justify-center gap-5"
      >
        Bla
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: false,
});

import { z } from "zod";
import { zodResolver } from "@primevue/forms/resolvers/zod";

const toast = useToast();

const initialValues = ref({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
});

const resolver = ref(
  zodResolver(
    z.object({
      firstName: z.string().min(1, { message: "First Name is required" }),
      lastName: z.string().min(1, { message: "Last Name is required" }),
      email: z
        .email({ message: "Invalid email address" })
        .min(1, { message: "Email is required" }),
      password: z
        .string()
        .min(3, { message: "Minimum 3 characters" })
        .max(8, { message: "Maximum 8 characters" })
        .refine((value) => /[a-z]/.test(value), {
          message: "Must have a lowercase letter",
        })
        .refine((value) => /[A-Z]/.test(value), {
          message: "Must have an uppercase letter",
        }),
    })
  )
);

const onFormSubmit = ({ valid, values }) => {
  if (valid) {
    toast.add({
      severity: "success",
      summary: "Form is submitted.",
      life: 3000,
    });
  }

  console.log({ values });
};
</script>
