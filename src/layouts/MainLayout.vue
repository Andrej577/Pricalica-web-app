<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> Pocetna </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered :width="220">
      <div class="column fit no-wrap">
        <q-list padding>
          <q-item-label header> Izbornik </q-item-label>

          <q-item clickable v-ripple to="/pocetna">
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>
            <q-item-section>Pocetna</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/recenzije">
            <q-item-section avatar>
              <q-icon name="rate_review" />
            </q-item-section>
            <q-item-section>Vase recenzije</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/profil/2">
            <q-item-section avatar>
              <q-icon name="person" />
            </q-item-section>
            <q-item-section>Uredi podatke</q-item-section>
          </q-item>
        </q-list>

        <q-space />

        <q-list v-if="isAdmin" padding class="q-pt-none">
          <q-item clickable v-ripple to="/admin/korisnici">
            <q-item-section avatar>
              <q-icon name="groups" />
            </q-item-section>
            <q-item-section>Upravljanje korisnicima</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/admin/knjige">
            <q-item-section avatar>
              <q-icon name="menu_book" />
            </q-item-section>
            <q-item-section>Upravljanje knjigama</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/admin/recenzije">
            <q-item-section avatar>
              <q-icon name="reviews" />
            </q-item-section>
            <q-item-section>Upravljanje recenzijama</q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-drawer>

    <q-page-container class="bg-grey-2">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthState } from 'src/composables/auth'

const leftDrawerOpen = ref(true)
const { isAdmin } = useAuthState()

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
<style scoped>
.page-enter-active,
.page-leave-active {
  transition: all 0.25s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
