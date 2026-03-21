<template>
  <q-page class="q-pa-md flex justify-center">
    <div class="page-wrapper">
      <q-input v-model="search" outlined dense placeholder="Pretraži knjigu" class="q-mb-md">
        <template #prepend>
          <q-icon name="search" />
        </template>
      </q-input>

      <q-card flat bordered class="q-mb-md">
        <q-card-section class="text-subtitle1 text-weight-bold">
          Nastavi sa slušanjem
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="book-grid">
            <q-card
              v-for="item in continueListening"
              :key="item.id"
              flat
              bordered
              class="book-card"
            >
              <div class="book-cover-placeholder" />
              <q-card-section class="q-pa-sm">
                <div class="text-caption text-center ellipsis">
                  {{ item.title }}
                </div>
              </q-card-section>
            </q-card>
          </div>
        </q-card-section>
      </q-card>

      <q-card flat bordered>
        <q-card-section class="text-subtitle1 text-weight-bold"> Biblioteka </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="book-grid">
            <q-card v-for="item in filteredLibrary" :key="item.id" flat bordered class="book-card">
              <div class="book-cover-placeholder" />
              <q-card-section class="q-pa-sm">
                <div class="text-caption text-center ellipsis">
                  {{ item.title }}
                </div>
              </q-card-section>
            </q-card>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { API_BASE_URL } from 'src/config/api'
import { computed, ref } from 'vue'

const search = ref('')

const continueListening = ref([
  { id: 1, title: 'Item 1123' },
  { id: 2, title: 'Item 2' },
  { id: 3, title: 'Item 3' },
  { id: 4, title: 'Item 4' },
])

const library = ref([
  { id: 1, title: 'Book 1' },
  { id: 2, title: 'Book 2' },
  { id: 3, title: 'Book 3' },
  { id: 4, title: 'Book 4' },
  { id: 5, title: 'Book 5' },
  { id: 6, title: 'Book 6' },
  { id: 7, title: 'Book 7' },
  { id: 8, title: 'Book 8' },
  { id: 9, title: 'Book 9' },
  { id: 10, title: 'Book 10' },
  { id: 11, title: 'Book 11' },
  { id: 12, title: 'Book 12' },
])

const filteredLibrary = computed(() => {
  if (!search.value.trim()) return library.value

  return library.value.filter((item) =>
    item.title.toLowerCase().includes(search.value.toLowerCase()),
  )
})

async function fetchFromApi(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Fetch error:', error)
    throw error
  }
}
</script>

<style scoped>
.page-wrapper {
  width: 100%;
}

.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px;
}

.book-card {
  overflow: hidden;
}

.book-cover-placeholder {
  height: 180px;
  border-bottom: 1px solid #ddd;
  background:
    linear-gradient(to top right, transparent 49%, #999 50%, transparent 51%),
    linear-gradient(to bottom right, transparent 49%, #999 50%, transparent 51%);
  background-color: #f5f5f5;
}
</style>
