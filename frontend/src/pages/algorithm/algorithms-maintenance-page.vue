<template>
  <q-page class="bg-grey-1">
    <div class="row q-mx-md q-py-sm">
      <div class="col-9">
        <div class="float-left q-mr-lg" style="width:370px">
          <search-input
            label="Palabra clave para la búsqueda de algoritmos"
            @search="searchAlgorithm"
            @clear="tryClearingSearch"
          />
        </div>

        <div
          v-if="algorithmsCategories.data.categories.length"
          class="float-left q-mr-lg" style="width:auto;min-width:150px"
        >
          <q-select
            v-model="algorithms.data.searchCategory"
            :options="algorithmsCategories.data.categories"
            :option-label="opt => Object(opt) === opt && 'name' in opt ? opt.name : '- Null -'"
            label="Categoría"
            clearable
            @update:model-value="updateSearch"
          />
        </div>

        <div
          v-if="isMaster && users.data.users.length"
          class="float-left q-mr-lg" style="width:auto;min-width:150px"
        >
          <q-select
            v-model="algorithms.data.searchUser"
            :options="users.data.users"
            :option-label="opt => Object(opt) === opt && 'name' in opt ? opt.name : '- Null -'"
            label="Autor"
            clearable
            @update:model-value="updateSearch"
          />
        </div>
      </div>

      <div class="col-3 q-pt-lg q-pr-md text-right">
        <q-btn
          v-if="isMaintainer"
          label="Registrar algoritmo"
          color="primary"
          push
          @click="createAlgorithm"
        />
      </div>
    </div>

    <div
      v-if="showTable"
      class="q-px-md"
    >
      <q-card class="shadow-light">
        <q-card-section>
          <algorithms-table
            :is-maintainer="isMaintainer"
            :is-master="isMaster"
          />
        </q-card-section>
      </q-card>
    </div>

    <edit-algorithm-modal
      :is-maintainer="isMaintainer"
    />
  </q-page>
</template>

<script setup lang="ts">
import {
  onBeforeMount,
  provide,
  inject,
  ref,
} from 'vue';

import { onBeforeRouteLeave } from 'vue-router';

import { ALGORITHMS_EDITOR } from 'src/router/routes/algorithms';

import Settings from 'src/services/settings';
import SearchInput from 'components/inputs/search-input.vue';
import AlgorithmsTable from 'components/tables/algorithms-table.vue';
import Algorithms from 'src/services/algorithms';
import EditAlgorithmModal from 'components/modals/algorithms/edit-algorithm-modal.vue';
import AlgorithmsCategories from 'src/services/algorithms-categories';
import Users from 'src/services/users';
import { LocalStorage } from 'quasar';

const users = new Users();
provide('users', users);

const algorithms = new Algorithms();
provide('algorithms', algorithms);

const algorithmsCategories = new AlgorithmsCategories();
provide('algorithmsCategories', algorithmsCategories);

const settings = inject('settings') as Settings;

const isMaster = ref(false);
const isMaintainer = ref(false);
const showTable = ref(false);

const searchAlgorithm = (keyword: string) => {
  algorithms.data.searchKeyword = keyword;

  if (isMaintainer.value && !isMaster.value) {
    algorithms.data.searchUser = users.data.users.find((user) => user.id === LocalStorage.getItem('user'));
  }

  algorithms.search();
};

const updateSearch = () => {
  if (
    !algorithms.data.searchKeyword
    && !algorithms.data.searchCategory
    && !algorithms.data.searchUser
  ) {
    algorithms.clearSearch();

    algorithms.getAll();
  } else {
    algorithms.search();
  }
};

const createAlgorithm = () => algorithms.startCreating();

const tryClearingSearch = () => {
  algorithms.clearSearch();

  if (
    algorithms.data.searchCategory
    || algorithms.data.searchUser
  ) {
    algorithms.search();
  } else {
    algorithms.getAll();
  }
};

onBeforeMount(async () => {
  const { maintainer, master } = await settings.getUserRoles();

  isMaintainer.value = !!maintainer;
  isMaster.value = !!master;

  showTable.value = true;

  settings.page.setTitle('Mantenimiento de algoritmos');

  await users.get();

  await algorithmsCategories.get();
});

onBeforeRouteLeave((leaveGuard) => {
  if (leaveGuard.name === ALGORITHMS_EDITOR) {
    settings.page.mainMenu = false;
  }
});
</script>
