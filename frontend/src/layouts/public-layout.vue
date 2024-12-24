<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <div class="row full-width">
          <div class="col-7">
            <div class="header-text">
              Algoritmos Clínicos
            </div>
          </div>
          <div class="col-5">
            <q-img :src="LogoHeader" />
          </div>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-if="showMenuButton"
      v-model="settings.page.mainMenu"
      show-if-above
      bordered
      class="bg-info"
    >
      <main-menu />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <div
      class="fixed-bottom-left bg-white q-pa-sm app-version shadow-light-with-borders"
    >
      Version: {{ appVersion }}
    </div>

    <simple-modal
      :show="showLogoutDialog"
      confirm-label="Salir"
      @cancel="toggleLogoutDialog"
      @confirm="logout"
    >
      <div class="q-px-xl q-pt-lg text-center">
        <div class="q-py-lg">
          ¿Seguro que quieres salir?
        </div>
      </div>
    </simple-modal>
  </q-layout>
</template>

<script setup lang="ts">
import {
  computed,
  onBeforeMount,
  onMounted,
  inject,
  ref,
} from 'vue';

import { useRoute, useRouter } from 'vue-router';

import { LocalStorage } from 'quasar';

import Settings from 'src/services/settings';
import MainMenu from 'components/menus/main-menu.vue';
import SimpleModal from 'components/modals/simple-modal.vue';

import {
  ALGORITHMS_EDITOR,
  ALGORITHMS_PUBLIC_EDITOR,
  ALGORITHMS_PUBLIC_SEARCH,
} from 'src/router/routes/algorithms';

import { ACCOUNT_LOGIN } from 'src/router/routes/account';

import LogoHeader from 'src/assets/imgs/logo_paho_header.png';

const route = useRoute();
const router = useRouter();

const settings = inject('settings') as Settings;

const isMaster = ref(false);

const showLogoutDialog = ref(false);

const userName = computed(() => LocalStorage.getItem('user_name'));
const appVersion = computed(() => process.env.APP_VERSION || 0);

const toggleLeftDrawer = () => {
  settings.page.mainMenu = !settings.page.mainMenu;
};

const isPublicView = computed(() => Settings.isPublicView(route.name));

const showMenuButton = computed(
  () => ![
    ALGORITHMS_EDITOR,
    ALGORITHMS_PUBLIC_SEARCH,
    ALGORITHMS_PUBLIC_EDITOR,
  ].includes(String(route.name)),
);

const logout = () => {
  LocalStorage.remove('token');
  LocalStorage.remove('user');
  LocalStorage.remove('user_name');

  window.location.reload();
};

const toggleLogoutDialog = () => {
  showLogoutDialog.value = !showLogoutDialog.value;
};

onBeforeMount(async () => {
  isMaster.value = await Settings.isMaster();
});

onMounted(async () => {
  const token = LocalStorage.getItem('token');

  if (!token && !Settings.isPublicView(route.name)) {
    void router.push({
      name: ACCOUNT_LOGIN,
    });
  }
});
</script>

<style lang="sass">
.app-version
  z-index: 1000
  bottom: 16px
  -webkit-border-top-right-radius: 8px
  -webkit-border-bottom-right-radius: 8px
  -moz-border-radius-topright: 8px
  -moz-border-radius-bottomright: 8px
  border-top-right-radius: 8px
  border-bottom-right-radius: 8px

.header-text
  margin-left: 15px
  margin-top: 26px
  padding: 10px
  width: 250px
  background-color: white
  border-radius: 10px
  color: var(--q-primary)
  font-size: 24px
  font-weight: bold
  text-align: center
</style>
