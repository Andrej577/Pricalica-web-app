<template>
  <q-page padding>
    <div class="row items-center q-col-gutter-md q-mb-md">
      <div class="col-auto">
        <q-btn label="Dodaj novu" color="primary" @click="showDialog = true" />
      </div>

      <div class="col text-center">
        <div class="text-h6">Vaše recenzije</div>
      </div>

      <div class="col-auto">
        <div class="row q-gutter-sm">
          <q-btn label="View" outline color="primary" :disable="!selected.length" />
          <q-btn label="Uredi" outline color="primary" :disable="!selected.length" />
          <q-btn label="Izbriši" outline color="negative" :disable="!selected.length" />
        </div>
      </div>
    </div>

    <q-table
      flat
      bordered
      :rows="rows"
      :columns="columns"
      row-key="id"
      selection="single"
      v-model:selected="selected"
    />

    <review-dialog v-model="showDialog" :books="books" @save="handleSaveReview" />
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import ReviewDialog from 'src/pages/RecenzijaDialogPage.vue'

const showDialog = ref(false)
const selected = ref([])

const books = ref([
  { id: 1, naziv: 'Harry Potter' },
  { id: 2, naziv: 'Gospodar prstenova' },
  { id: 3, naziv: '1984' },
])

const columns = [
  {
    name: 'naslov',
    label: 'Naslov',
    field: 'naslov',
    align: 'left',
  },
  {
    name: 'recenzija',
    label: 'Recenzija',
    field: 'recenzija',
    align: 'left',
  },
  {
    name: 'ocjena',
    label: 'Ocjena',
    field: 'ocjena',
    align: 'center',
  },
  {
    name: 'utisci',
    label: 'Utisci',
    field: 'utisci',
    align: 'left',
  },
]

const rows = ref([
  {
    id: 1,
    naslov: 'Harry Potter',
    recenzija: 'Vrlo zanimljiva knjiga sa odličnom radnjom.',
    ocjena: 5,
    utisci: 'Preporuka',
  },
])

function handleSaveReview(review) {
  const knjiga = books.value.find((x) => x.id === review.knjigaId)

  rows.value.push({
    id: Date.now(),
    naslov: knjiga ? knjiga.naziv : '',
    recenzija: review.tekst,
    ocjena: review.ocjena,
    utisci: review.ocjena >= 4 ? 'Odlično' : 'Dobro',
  })

  console.log('Saved review:', review)
}
</script>
