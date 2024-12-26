<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <div class="row full-width">
        <div class="col-7 flex items-center">
          <q-img
            :src="SitemapIcon"
            fit="contain"
            style="margin:10px;height:52px;width:52px"
          /> <div class="header-text">Algoritmos Clínicos - Búsqueda de algoritmos</div>
        </div>
        <div class="col-5">
          <q-img
            :src="LogoHeader"
            class="float-right"
            fit="contain"
            style="height:74px;width:400px"
          />
        </div>
      </div>
    </q-header>

    <q-page-container>
      <div class="page-container-background">
        <router-view />
      </div>
    </q-page-container>

    <q-footer>
      <div style="padding:14px">Version: {{ appVersion }}</div>

      <div class="powered-by">Powered<br/>by</div>

      <q-img
        :src="LogoBiremeWhite"
        fit="contain"
        class="logo-bireme-footer"
      />
    </q-footer>

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

import SitemapIcon from 'src/assets/imgs/icons/sitemap.png';
import LogoHeader from 'src/assets/imgs/logo_paho_header.png';
import LogoBiremeWhite from "assets/imgs/logo-bireme-white.png";

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
.page-container-background
  background-color: #1ABC9C !important
  background-image: url('/imgs/backgrounds/page-background.jpg') !important
  background-size: 100%
  background-position: center bottom

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
  display: inline-block
  font-size: 22px
  font-weight: 500
  text-align: center

.powered-by
  position: absolute
  top: 9px
  left: calc(50% - 63px)
  text-align: right
  font-size: 13px
  line-height: 14px

.logo-bireme-footer
  position: absolute
  top: 11px
  left: 50%
  height: 24px
  width: 120px
  border-left: 1px solid white
</style>
