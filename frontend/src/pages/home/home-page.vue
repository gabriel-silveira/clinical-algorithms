<template>
  <q-page padding>
    <div class="full-width full-height">
      <q-img
        :src="Logo"
        class="absolute-top-right"
        style="margin: 25px 25px 0 0"
        width="25%"
        alt="PAHO"
      />

      <div
        style="position:absolute;width:600px;top:50%;margin-top:-90px;left:50%;margin-left:-300px"
      >

        <div
          class="q-mt-md text-center text-primary text-bold"
          style="font-size:42px"
        >
          Sistema de algoritmos clínicos
        </div>
      </div>
    </div>

    <div
      class="absolute-bottom-left bg-primary full-width"
      style="height:54px"
    >
      <div
        class="absolute-top-right text-white text-bold text-right q-pr-md"
        style="font-size:14px;line-height:110%;right:310px;top:10px;border-right:2px solid white"
      >
        <div class="float-left">Powered<br/>by</div>
      </div>

      <q-img
        :src="LogoBiremeWhite"
        class="absolute-top-right auto"
        style="top:11px;right:177px"
        width="117px"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { inject, onBeforeMount } from 'vue';
import Settings from 'src/services/settings';
import Logo from 'assets/imgs/logo_large.png';
import LogoBiremeWhite from 'assets/imgs/logo-bireme-white.png';

const settings = inject('settings') as Settings;

onBeforeMount(() => {
  settings.page.setTitle('Inicio');
});
</script>
