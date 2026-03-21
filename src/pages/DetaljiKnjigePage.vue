<template>
  <q-page class="q-pa-md">
    <div class="text-h5 q-mb-md">Detalji knjige</div>
    <div>ID knjige: {{ route.params.id }}</div>
  </q-page>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>
