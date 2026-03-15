<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card class="review-dialog">
      <q-card-section class="row items-center justify-between q-pb-sm">
        <q-btn label="Povratak" flat color="grey-8" @click="onBack" />

        <q-btn
          label="Spremi"
          color="positive"
          :disable="!form.knjigaId || !form.ocjena || !form.tekst.trim()"
          @click="onSave"
        />
      </q-card-section>

      <q-card-section class="q-pt-sm">
        <q-select
          v-model="form.knjigaId"
          :options="bookOptions"
          option-value="value"
          option-label="label"
          emit-value
          map-options
          label="Odaberi knjigu"
          outlined
          class="q-mb-lg"
        />

        <div class="q-mb-md">
          <q-rating
            v-model="form.ocjena"
            size="2.2rem"
            color="primary"
            icon="star_border"
            icon-selected="star"
            icon-half="star_half"
          />
        </div>

        <q-input
          v-model="form.tekst"
          type="textarea"
          outlined
          autogrow
          label="Tekst recenzije"
          input-style="min-height: 180px;"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, reactive } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  books: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue', 'save'])

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const form = reactive({
  knjigaId: null,
  ocjena: 0,
  tekst: '',
})

const bookOptions = computed(() =>
  props.books.map((x) => ({
    label: x.naziv,
    value: x.id,
  })),
)

function resetForm() {
  form.knjigaId = null
  form.ocjena = 0
  form.tekst = ''
}

function onBack() {
  isOpen.value = false
}

function onSave() {
  emit('save', {
    knjigaId: form.knjigaId,
    ocjena: form.ocjena,
    tekst: form.tekst,
  })

  resetForm()
  isOpen.value = false
}
</script>

<style scoped>
.review-dialog {
  width: 520px;
  max-width: 90vw;
}
</style>
