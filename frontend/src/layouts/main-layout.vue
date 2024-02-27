<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          v-if="showMenuButton"
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          {{ settings.page.title }}
        </q-toolbar-title>

        <div
          v-if="!isPublicView"
        >
          <div class="inline-block q-mr-md">
            <b>{{ userName }}</b> {{ isMaster ? '(Master)' : '' }}
          </div>

          <div class="inline-block q-mr-xs">
            <q-btn
              class="q-px-md q-py-xs"
              label="Salir"
              outline
              @click="toggleLogoutDialog"
            />
          </div>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-if="showMenuButton"
      v-model="settings.page.mainMenu"
      show-if-above
      bordered
      class="bg-secondary"
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
  inject,
  ref,
} from 'vue';

import { useRoute } from 'vue-router';

import { LocalStorage } from 'quasar';

import Settings from 'src/services/settings';
import MainMenu from 'components/menus/main-menu.vue';
import { ALGORITHMS_EDITOR, ALGORITHMS_PUBLIC_EDITOR, ALGORITHMS_PUBLIC_SEARCH } from 'src/router/routes/algorithms';
import SimpleModal from 'components/modals/simple-modal.vue';

const route = useRoute();

const settings = inject('settings') as Settings;

const isMaster = ref(false);

const showLogoutDialog = ref(false);

const userName = computed(() => LocalStorage.getItem('user_name'));
const appVersion = computed(() => process.env.APP_VERSION || 0);

const toggleLeftDrawer = () => {
  settings.page.mainMenu = !settings.page.mainMenu;
};

const isPublicView = computed(() => settings.isPublicView);

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
  isMaster.value = await settings.isMaster();
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
</style>
