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
  </q-page>
</template>

<script setup lang="ts">
import { inject, onBeforeMount } from 'vue';
import Settings from 'src/services/settings';
import Logo from 'assets/imgs/logo_large.png';

const settings = inject('settings') as Settings;

onBeforeMount(() => {
  settings.page.setTitle('Inicio');
});
</script>
