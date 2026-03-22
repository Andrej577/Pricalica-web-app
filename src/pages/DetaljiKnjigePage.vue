<template>
  <q-page class="q-pa-md flex justify-center">
    <div class="page-wrapper">
      <q-card flat bordered class="full-width">
        <q-card-section class="row items-center justify-between">
          <q-btn label="Povratak" outline color="primary" @click="idiNatrag" />

          <q-btn
            label="Pokreni"
            color="primary"
            :disable="!knjiga.poveznica"
            @click="pokreniKnjigu"
          />
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="text-h5 text-weight-bold text-center q-mb-lg">
            {{ knjiga.naslov }}
          </div>

          <div class="row q-col-gutter-xl q-mb-lg">
            <div class="col-12 col-md-4">
              <div class="q-mb-md">
                <div class="text-subtitle1 text-weight-bold">Autor</div>
                <div>{{ knjiga.autor }}</div>
              </div>

              <div>
                <div class="text-subtitle1 text-weight-bold">Žanr</div>
                <div>{{ knjiga.zanr }}</div>
              </div>
            </div>

            <div class="col-12 col-md-8">
              <div class="text-subtitle1 text-weight-bold q-mb-sm">Opis</div>
              <div>{{ knjiga.opis }}</div>
            </div>
          </div>

          <div class="row items-center justify-between q-mb-md">
            <div class="text-subtitle1 text-weight-bold">Recenzije</div>
            <q-btn label="Dodaj recenziju" outline color="primary" to="/recenzije" />
          </div>

          <q-markup-table flat bordered separator="cell">
            <thead>
              <tr>
                <th class="text-left">Datum</th>
                <th class="text-left">Ime</th>
                <th class="text-left">Prezime</th>
                <th class="text-left">Recenzija</th>
                <th class="text-left">Ocjena</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="recenzija in recenzije" :key="recenzija.id">
                <td>{{ recenzija.datum }}</td>
                <td>{{ recenzija.ime }}</td>
                <td>{{ recenzija.prezime }}</td>
                <td>{{ recenzija.tekst }}</td>
                <td>{{ recenzija.ocjena }}</td>
              </tr>

              <tr v-if="recenzije.length === 0">
                <td colspan="5" class="text-center">Nema recenzija</td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import axios from 'axios'
import { API_BASE_URL } from 'src/config/api'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()

const knjiga = ref({
  naslov: '',
  autor: '',
  zanr: '',
  opis: '',
  poveznica: '',
})
const recenzije = ref([])

onMounted(() => {
  ucitajPodatke()
})

async function ucitajPodatke() {
  const knjigaId = route.params.id

  if (!knjigaId) {
    $q.notify({ type: 'negative', message: 'Nedostaje ID knjige.' })
    return
  }

  await Promise.all([getKnjigaDetalji(knjigaId), getRecenzije(knjigaId)])
}

function idiNatrag() {
  router.back()
}

function pokreniKnjigu() {
  if (!knjiga.value.poveznica) {
    $q.notify({ type: 'warning', message: 'Ova knjiga nema dostupnu poveznicu.' })
    return
  }

  router.push(`/knjige/${route.params.id}/reprodukcija`)
}

async function getRecenzije(knjigaId) {
  try {
    const res = await axios.get(`${API_BASE_URL}/interakcije/knjiga/${knjigaId}`)

    if (res.status !== 200) {
      throw new Error('Failed to fetch reviews')
    }

    recenzije.value = Array.isArray(res.data) ? res.data : []
  } catch (error) {
    console.error('Failed to fetch reviews', error)
    recenzije.value = []
    $q.notify({ type: 'negative', message: 'Neuspjelo ucitavanje recenzija.' })
  }
}

async function getKnjigaDetalji(knjigaId) {
  try {
    const res = await axios.get(`${API_BASE_URL}/knjige/${knjigaId}`)

    if (res.status !== 200) {
      throw new Error('Failed to fetch book details')
    }

    const data = res.data ?? {}

    knjiga.value = {
      naslov: data.naslov ?? data.title ?? '',
      autor: data.autor ?? '',
      zanr: data.zanr ?? '',
      opis: data.opis ?? '',
      poveznica: data.poveznica ?? '',
    }

    console.log('Knjiga details:', knjiga.value)
  } catch (error) {
    console.error('Failed to fetch book details', error)
    $q.notify({ type: 'negative', message: 'Neuspjelo ucitavanje detalja knjige.' })
  }
}
</script>

<style scoped>
.page-wrapper {
  width: 100%;
}
</style>
