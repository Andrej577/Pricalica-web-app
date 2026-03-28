const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'pocetna', component: () => import('pages/PocetnaPage.vue') },
      { path: 'recenzije', component: () => import('pages/RecenzijePage.vue') },
      { path: 'knjige/:id', component: () => import('pages/DetaljiKnjigePage.vue') },
      { path: 'knjige/:id/reprodukcija', component: () => import('pages/ReprodukcijaPage.vue') },
      { path: 'profil/:id', component: () => import('pages/DetaljiKorisnikaPage.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
