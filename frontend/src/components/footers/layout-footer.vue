<template>
  <q-footer>
    <div style="padding:14px">Version: {{ appVersion }}</div>

    <div class="powered-by">Powered<br/>by</div>

    <q-img
      :src="LogoBiremeWhite"
      fit="contain"
      class="logo-bireme-footer"
    />
  </q-footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import LogoBiremeWhite from 'src/assets/imgs/logo-bireme-white.png';

const appVersion = computed(() => process.env.APP_VERSION || 0);
</script>

<style lang="sass">
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
