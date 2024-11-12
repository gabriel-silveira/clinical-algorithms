<template>
  <router-view />
</template>

<script setup lang="ts">
import { provide } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import Settings from 'src/services/settings';
import AlgorithmsCategories from 'src/services/algorithms-categories';
import { LocalStorage, useQuasar } from 'quasar';
import Editor from 'src/services/editor';

const route = useRoute();
const router = useRouter();
const quasar = useQuasar();

const settings = new Settings(route);
settings.page.setTitle('Início');
provide('settings', settings);

provide('editor', new Editor(quasar, route, router));

provide(new AlgorithmsCategories(), 'algorithmsCategories');

settings.setUser(LocalStorage.getItem('user') || 0);
</script>
