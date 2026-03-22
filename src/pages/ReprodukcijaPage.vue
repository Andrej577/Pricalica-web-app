<template>
  <q-page class="q-pa-md flex justify-center">
    <div class="page-wrapper">
      <q-card flat bordered class="full-width">
        <q-card-section class="row items-center justify-between">
          <q-btn label="Povratak" outline color="primary" @click="idiNatrag" />
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="text-h5 text-weight-bold text-center q-mb-xl">
            {{ naslovKnjige }}
          </div>

          <div class="row justify-between text-subtitle1 text-weight-bold q-mb-sm">
            <div>Pocetak</div>
            <div>Kraj</div>
          </div>

          <q-slider
            v-model="currentTime"
            :min="0"
            :max="duration || 1"
            :step="1"
            color="primary"
            class="q-mb-md"
            @change="promijeniPoziciju"
          />

          <div class="row justify-between text-caption q-mb-lg">
            <div>{{ formatirajVrijeme(currentTime) }}</div>
            <div>{{ formatirajVrijeme(duration) }}</div>
          </div>

          <div class="row justify-center q-gutter-sm">
            <q-btn label="Pokreni" color="primary" @click="pokreni" />
            <q-btn label="Pauziraj" outline color="primary" @click="pauziraj" />
            <q-btn label="Zaustavi" outline color="negative" @click="zaustavi" />
          </div>
        </q-card-section>
      </q-card>
    </div>

    <audio
      ref="audioRef"
      :src="audioSrc"
      preload="metadata"
      @loadedmetadata="onLoadedMetadata"
      @timeupdate="onTimeUpdate"
      @ended="onAudioEnded"
    />
  </q-page>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import axios from 'axios'
import { API_BASE_URL } from 'src/config/api'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()

const audioRef = ref(null)
const knjiga = ref({
  naslov: '',
  poveznica: '',
})
const currentTime = ref(0)
const duration = ref(0)

const naslovKnjige = computed(() => knjiga.value.naslov || 'Naslov knjige')
const audioSrc = computed(() => {
  const poveznica = knjiga.value.poveznica?.trim()

  if (!poveznica) {
    return ''
  }

  if (poveznica.startsWith('http://') || poveznica.startsWith('https://')) {
    return poveznica
  }

  return `http://localhost:5000/stream?file=sample.mp3`
})

onMounted(() => {
  ucitajKnjigu()
})

onBeforeUnmount(() => {
  if (audioRef.value) {
    audioRef.value.pause()
  }
})

function idiNatrag() {
  router.back()
}

async function ucitajKnjigu() {
  const knjigaId = route.params.id

  if (!knjigaId) {
    $q.notify({ type: 'negative', message: 'Nedostaje ID knjige.' })
    return
  }

  try {
    const res = await axios.get(`${API_BASE_URL}/knjige/${knjigaId}`)

    if (res.status !== 200) {
      throw new Error('Failed to fetch book details')
    }

    const data = res.data ?? {}

    knjiga.value = {
      naslov: data.naslov ?? data.title ?? '',
      poveznica: data.poveznica ?? '',
    }

    if (!knjiga.value.poveznica) {
      $q.notify({ type: 'warning', message: 'Ova knjiga nema dostupnu audio poveznicu.' })
    }
  } catch (error) {
    console.error('Failed to fetch book details', error)
    $q.notify({ type: 'negative', message: 'Neuspjelo ucitavanje knjige.' })
  }
}

async function pokreni() {
  if (!audioRef.value || !audioSrc.value) {
    $q.notify({ type: 'warning', message: 'Audio nije dostupan za reprodukciju.' })
    return
  }

  try {
    audioRef.value.load()
    await audioRef.value.play()
  } catch (error) {
    console.error('Playback failed', error)
    $q.notify({ type: 'negative', message: 'Reprodukcija nije uspjela. Provjeri postoji li MP3 na music-serviceu.' })
  }
}

function pauziraj() {
  if (!audioRef.value) {
    return
  }

  audioRef.value.pause()
}

function zaustavi() {
  if (!audioRef.value) {
    return
  }

  audioRef.value.pause()
  audioRef.value.currentTime = 0
  currentTime.value = 0
}

function promijeniPoziciju(value) {
  if (!audioRef.value) {
    return
  }

  audioRef.value.currentTime = value
  currentTime.value = value
}

function onLoadedMetadata() {
  duration.value = Number.isFinite(audioRef.value?.duration) ? audioRef.value.duration : 0
}

function onTimeUpdate() {
  currentTime.value = audioRef.value?.currentTime ?? 0
}

function onAudioEnded() {
  currentTime.value = 0
}

function formatirajVrijeme(value) {
  const totalSeconds = Math.max(0, Math.floor(value || 0))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}
</script>

<style scoped>
.page-wrapper {
  width: 100%;
}
</style>
