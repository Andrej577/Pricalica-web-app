<template>
  <q-page class="q-pa-md flex flex-center bg-grey-2">
    <div class="page-wrapper">
      <q-card flat bordered class="user-card">
        <q-card-section class="row items-center justify-between q-pb-sm">
          <div class="text-h6 text-weight-medium">Uredivanje korisnika</div>
          <q-btn flat round dense icon="close" @click="idiNatrag" />
        </q-card-section>

        <q-separator />

        <q-form v-if="!loading" class="q-gutter-md" @submit.prevent="spremiKorisnika">
          <q-card-section class="q-pt-lg">
            <div class="row items-center justify-between q-col-gutter-md top-actions">
              <div class="col-12 col-sm-auto">
                <q-btn label="Povratak" outline color="primary" @click="idiNatrag" />
              </div>

              <div class="col-12 col-sm-auto">
                <q-btn label="Spremi" color="positive" type="submit" />
              </div>
            </div>

            <div class="text-caption text-grey-7 text-center q-mt-md">
              ID korisnika: {{ korisnik.id }}
            </div>

            <div class="form-grid q-mx-auto q-mt-md">
              <q-input
                v-model="korisnik.ime"
                outlined
                label="Ime"
                autocomplete="given-name"
              />

              <q-input
                v-model="korisnik.prezime"
                outlined
                label="Prezime"
                autocomplete="family-name"
              />

              <q-input
                v-model="korisnik.email"
                outlined
                type="email"
                label="E-mail"
                autocomplete="email"
              />

              <q-input
                v-model="korisnik.lozinka"
                outlined
                :type="showPassword ? 'text' : 'password'"
                label="Lozinka"
                autocomplete="new-password"
              >
                <template #append>
                  <q-icon
                    :name="showPassword ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="showPassword = !showPassword"
                  />
                </template>
              </q-input>

              <q-select
                v-model="korisnik.statusRacuna"
                outlined
                emit-value
                map-options
                label="Status racuna"
                :options="statusOpcije"
              />

              <q-checkbox v-model="korisnik.aktivan" label="Aktivan" disable />
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right" class="q-pa-md">
            <q-btn color="negative" label="Obrisi racun" @click="obrisiRacun" />
          </q-card-actions>
        </q-form>

        <q-card-section v-else class="q-py-xl">
          <div class="row justify-center">
            <q-spinner color="primary" size="40px" />
          </div>
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

const showPassword = ref(false)
const loading = ref(true)

const statusOpcije = [
  { label: 'Aktivan', value: 1 },
  { label: 'Neaktivan', value: 2 },
]

const korisnik = ref({
  id: null,
  ime: '',
  prezime: '',
  email: '',
  lozinka: '',
  statusRacuna: 1,
  aktivan: false,
})

onMounted(() => {
  ucitajKorisnika()
})

function idiNatrag() {
  router.back()
}

async function ucitajKorisnika() {
  const korisnikId = route.params.id
  if (!korisnikId) {
    loading.value = false
    $q.notify({
      type: 'negative',
      message: 'Nedostaje ID korisnika.',
    })
    return
  }

  try {
    const res = await axios.get(`${API_BASE_URL}/korisnici/${korisnikId}`)

    if (res.status !== 200) {
      throw new Error('Failed to fetch user')
    }

    mapirajKorisnika(res.data)
  } catch (error) {
    console.error('Failed to fetch user details', error)
      $q.notify({
        type: 'negative',
        message: 'Neuspjelo učitavanje detalja korisnika.',
      })
  } finally {
    loading.value = false
  }
}

function mapirajKorisnika(data) {
  const status = Number(data.statusRacuna_id ?? data.statusRacuna ?? 2)

  korisnik.value = {
    id: data.korisnik_id ?? data.id ?? null,
    ime: data.ime ?? '',
    prezime: data.prezime ?? '',
    email: data.email ?? '',
    lozinka: data.lozinka_hash ?? '',
    statusRacuna: status,
    aktivan: status === 1,
  }
}

async function spremiKorisnika() {
  if (!korisnik.value.id) {
    $q.notify({
      type: 'negative',
      message: 'Korisnik nije ucitan pa spremanje nije moguce.',
    })
    return
  }

  try {
    const payload = {
      ...korisnik.value,
      statusRacuna: korisnik.value.aktivan ? korisnik.value.statusRacuna : 2,
    }

    const res = await axios.put(`${API_BASE_URL}/korisnici/${korisnik.value.id}`, payload)

    if (res.status !== 200) {
      throw new Error('Failed to update user')
    }

    mapirajKorisnika(res.data)

    $q.notify({
      type: 'positive',
      message: 'Podaci o korisniku su spremljeni.',
    })
  } catch (error) {
    console.error('Failed to update user', error)
    $q.notify({
      type: 'negative',
      message: 'Spremanje korisnika nije uspjelo.',
    })
  }
}

function obrisiRacun() {
  $q.dialog({
    title: 'Potvrda brisanja',
    message: 'Jeste li sigurni da zelite obrisati ovaj racun?',
    cancel: true,
    persistent: true,
    ok: {
      color: 'negative',
      label: 'Obrisi',
    },
  }).onOk(async () => {
    if (!korisnik.value.id) {
      return
    }

    try {
      const res = await axios.delete(`${API_BASE_URL}/korisnici/${korisnik.value.id}`)

      if (res.status !== 200) {
        throw new Error('Failed to delete user')
      }

      $q.notify({
        type: 'warning',
        message: 'Korisnicki racun je obrisan.',
      })

      router.push('/')
    } catch (error) {
      console.error('Failed to delete user', error)
      $q.notify({
        type: 'negative',
        message: 'Brisanje korisnika nije uspjelo.',
      })
    }
  })
}
</script>

<style scoped>
.page-wrapper {
  width: 100%;
  max-width: 720px;
}

.user-card {
  width: 100%;
}

.form-grid {
  width: 100%;
  max-width: 420px;
  display: grid;
  gap: 16px;
}

@media (max-width: 599px) {
  .top-actions {
    row-gap: 12px;
  }
}
</style>
