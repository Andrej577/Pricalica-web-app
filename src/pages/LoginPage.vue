<template>
  <q-page class="q-pa-md flex flex-center bg-grey-2">
    <q-card flat bordered class="login-card">
      <q-card-section class="text-center q-pb-sm">
        <div class="text-h5 text-weight-medium">Prijava</div>
        <div class="text-caption text-grey-7 q-mt-sm">
          Odaberite unaprijed pripremljenu prijavu za administratora ili korisnika
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section class="q-pt-lg">
        <div class="login-grid">
          <q-form
            class="credential-form"
            data-testid="admin-login-form"
            @submit.prevent="submitLogin(adminForm)"
          >
            <div class="text-subtitle1 text-weight-medium">Administrator</div>
            <div class="text-caption text-grey-7 q-mb-md">
              Zadani račun iz baze za administraciju sustava
            </div>

            <q-input
              v-model.trim="adminForm.email"
              outlined
              type="email"
              label="E-mail"
              autocomplete="email"
              data-testid="admin-email-input"
              lazy-rules
              :rules="[(val) => !!val || 'Unesite e-mail']"
            >
              <template #prepend>
                <q-icon name="mail" />
              </template>
            </q-input>

            <q-input
              v-model="adminForm.lozinka"
              outlined
              :type="showAdminPassword ? 'text' : 'password'"
              label="Lozinka"
              autocomplete="current-password"
              data-testid="admin-password-input"
              lazy-rules
              :rules="[(val) => !!val || 'Unesite lozinku']"
            >
              <template #prepend>
                <q-icon name="lock" />
              </template>

              <template #append>
                <q-icon
                  :name="showAdminPassword ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="showAdminPassword = !showAdminPassword"
                />
              </template>
            </q-input>

            <q-btn
              label="Prijavi administratora"
              color="primary"
              type="submit"
              class="full-width"
              data-testid="admin-login-button"
              :loading="submittingAdmin"
            />
          </q-form>

          <q-form
            class="credential-form"
            data-testid="user-login-form"
            @submit.prevent="submitLogin(userForm)"
          >
            <div class="text-subtitle1 text-weight-medium">Korisnik</div>
            <div class="text-caption text-grey-7 q-mb-md">
              Zadani korisnički račun iz baze za pregled aplikacije
            </div>

            <q-input
              v-model.trim="userForm.email"
              outlined
              type="email"
              label="E-mail"
              autocomplete="email"
              data-testid="user-email-input"
              lazy-rules
              :rules="[(val) => !!val || 'Unesite e-mail']"
            >
              <template #prepend>
                <q-icon name="mail" />
              </template>
            </q-input>

            <q-input
              v-model="userForm.lozinka"
              outlined
              :type="showUserPassword ? 'text' : 'password'"
              label="Lozinka"
              autocomplete="current-password"
              data-testid="user-password-input"
              lazy-rules
              :rules="[(val) => !!val || 'Unesite lozinku']"
            >
              <template #prepend>
                <q-icon name="lock" />
              </template>

              <template #append>
                <q-icon
                  :name="showUserPassword ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="showUserPassword = !showUserPassword"
                />
              </template>
            </q-input>

            <q-btn
              label="Prijavi korisnika"
              color="secondary"
              text-color="dark"
              type="submit"
              class="full-width"
              data-testid="user-login-button"
              :loading="submittingUser"
            />
          </q-form>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="q-px-md q-pb-md">
        <q-btn
          label="Odustani"
          flat
          color="grey-8"
          :disable="submittingAdmin || submittingUser"
          @click="odustani"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { reactive, ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { API_BASE_URL } from 'src/config/api'
import { clearCurrentUserRole, setCurrentUserId, setCurrentUserRole } from 'src/composables/auth'

const router = useRouter()
const $q = useQuasar()

const showAdminPassword = ref(false)
const showUserPassword = ref(false)
const submittingAdmin = ref(false)
const submittingUser = ref(false)
const adminForm = reactive({
  email: 'maja.peric@example.com',
  lozinka: 'Maja*Secure5',
})
const userForm = reactive({
  email: 'sara.juric@example.com',
  lozinka: 'SaraLove44',
})

async function submitLogin(form) {
  if (!form.email || !form.lozinka) {
    $q.notify({
      type: 'warning',
      message: 'Unesite e-mail i lozinku.',
    })
    return
  }

  const isAdminForm = form === adminForm
  const submittingState = isAdminForm ? submittingAdmin : submittingUser
  submittingState.value = true

  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      email: form.email,
      lozinka: form.lozinka,
    })

    setCurrentUserRole(isAdminForm ? 'admin' : 'user')
    setCurrentUserId(response.data?.korisnik_id ?? '')

    $q.notify({
      type: 'positive',
      message: 'Prijava uspješna.',
    })

    router.push('/pocetna')
  } catch (error) {
    const message = error.response?.data?.error ?? 'Prijava nije uspjela.'

    $q.notify({
      type: 'negative',
      message,
    })
  } finally {
    submittingState.value = false
  }
}

function odustani() {
  clearCurrentUserRole()
  adminForm.email = 'maja.peric@example.com'
  adminForm.lozinka = 'Maja*Secure5'
  userForm.email = 'sara.juric@example.com'
  userForm.lozinka = 'SaraLove44'
  router.push('/')
}
</script>

<style scoped>
.login-card {
  width: 100%;
  max-width: 920px;
}

.login-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.credential-form {
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  background: white;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

@media (max-width: 700px) {
  .login-grid {
    grid-template-columns: 1fr;
  }
}
</style>
