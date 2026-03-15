<template>
  <q-page padding>
    <div class="q-pa-md">
      <div class="row items-center q-col-gutter-md q-mb-md">
        <div class="col-auto">
          <q-btn label="Dodaj" color="primary" @click="onDodaj" />
        </div>

        <div class="col text-center">
          <div class="text-h6">Vaše transakcije</div>
        </div>

        <div class="col-auto">
          <q-btn label="Nova transakcija" outline color="primary" @click="onNovaTransakcija" />
        </div>
      </div>

      <q-table flat bordered :rows="rows" :columns="columns" row-key="id" />
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const columns = [
  {
    name: 'datum',
    label: 'Datum',
    field: 'datum',
    align: 'left',
  },
  {
    name: 'iznos',
    label: 'Iznos',
    field: 'iznos',
    align: 'right',
  },
]

const rows = ref([
  {
    id: 1,
    datum: '15.03.2026',
    iznos: '12.99 €',
  },
  {
    id: 2,
    datum: '10.03.2026',
    iznos: '8.50 €',
  },
  {
    id: 3,
    datum: '02.03.2026',
    iznos: '19.90 €',
  },
])

function onDodaj() {
  console.log('Dodaj')
}

function onNovaTransakcija() {
  console.log('Nova transakcija')
}
</script>
