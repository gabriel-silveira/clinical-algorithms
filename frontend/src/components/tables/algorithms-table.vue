<template>
  <q-table
    :rows="algorithms.flowchartsList"
    :columns="columns"
    :loading="algorithms.data.loading"
    :rows-per-page-options="[0]"
    row-key="name"
    class="custom-table"
    flat
    :hide-bottom="!(algorithms.flowchartsList && !algorithms.flowchartsList.length)"
  >
    <template v-slot:loading>
      <q-inner-loading
        color="primary"
        showing
      />
    </template>

    <template v-slot:no-data>
      <b>No se encontraron algoritmos.</b>
    </template>

    <template v-slot:body="rows">
      <q-tr
        :props="rows"
        class="cursor-pointer"
        @click="editAlgorithm(rows.row, publicView ? 'public' : 'edit', publicViewInAdmin)"
      >
        <q-td :props="rows" key="title">
          <div class="q-py-sm">
            <b>{{ rows.row.title }}</b>
          </div>
        </q-td>

        <q-td
          :props="rows"
          key="status"
        >
          <div
            v-if="rows.row.public"
            class="q-py-sm text-positive"
          >
            Público
          </div>
          <div
            v-else
            class="q-py-sm text-grey-5"
          >
            No público
          </div>
        </q-td>

        <q-td key="user_id" :props="rows">
          {{ users.getUserName(rows.row.user_id) }}
        </q-td>

        <q-td key="updated_at" :props="rows">
          {{ formatDatetime(rows.row.updated_at) }}
        </q-td>

        <q-td
          key="action"
          :props="rows"
        >
          <q-btn
            v-if="!publicView && !publicViewInAdmin"
            icon="chevron_right"
            color="primary"
            flat
            @click.stop="viewFlowchartData(rows.row)"
          >
            <q-tooltip>Ver datos básicos</q-tooltip>
          </q-btn>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { computed, inject, onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { LocalStorage } from 'quasar';

import Settings from 'src/services/settings';
import Algorithms, { IAlgorithm } from 'src/services/algorithms';
import Users from 'src/services/users';

import { ALGORITHMS_EDITOR, ALGORITHMS_PUBLIC_EDITOR, ALGORITHMS_SEARCH } from 'src/router/routes/algorithms';
import { formatDatetime } from 'src/services/date';
import Editor from 'src/services/editor';

const props = defineProps({
  isMaintainer: {
    type: Boolean,
    default: false,
  },
  isMaster: {
    type: Boolean,
    default: false,
  },
  listAllAlgorithms: {
    type: Boolean,
    default: false,
  },
});

const users = inject('users') as Users;

const algorithms = inject('algorithms') as Algorithms;

const route = useRoute();
const router = useRouter();

const publicView = computed(() => Settings.isPublicView(route.name));

const publicViewInAdmin = computed(() => route.name === ALGORITHMS_SEARCH);

const columns = [
  {
    name: 'title',
    align: 'left',
    label: 'Título',
    field: 'title',
    // style: 'width:40%',
  },
  {
    name: 'user_id',
    align: 'left',
    label: 'Autor',
    field: 'user_id',
    // style: 'width:10%',
  },
  {
    name: 'updated_at',
    align: 'right',
    label: 'Última actualización.',
    field: 'updated_at',
    style: 'width:10%',
  },
  {
    name: 'action',
    align: 'right',
    label: '',
    field: 'action',
  },
];

if (publicView.value) {
  columns.splice(3, 1);
} else if (props.isMaster || props.isMaintainer) {
  columns.splice(1, 0, {
    name: 'status',
    align: 'left',
    label: 'Status',
    field: 'status',
    style: 'width:10%',
  });
}

const editAlgorithm = (
  algorithm: IAlgorithm,
  mode: 'edit' | 'public' = 'edit',
  fromAdmin = false,
) => {
  if (!props.isMaster && !props.isMaintainer) {
    return Editor.preview(algorithm.id);
  }

  if (mode === 'public' && fromAdmin) {
    return router.push({
      name: ALGORITHMS_PUBLIC_EDITOR,
      query: {
        id: algorithm.id,
        mode,
        from_admin: Number(fromAdmin),
      },
    });
  }

  if (mode === 'public') {
    return router.push({
      name: ALGORITHMS_PUBLIC_EDITOR,
      query: {
        id: algorithm.id,
        mode,
      },
    });
  }

  return router.push({
    name: ALGORITHMS_EDITOR,
    query: {
      id: algorithm.id,
      mode,
    },
  });
};

const viewFlowchartData = (algorithmId: IAlgorithm) => algorithms.viewAlgorithmData(algorithmId);

onBeforeMount(() => {
  if (props.isMaster || props.listAllAlgorithms) {
    algorithms.getAll(true);
  } else if (props.isMaintainer) {
    algorithms.getUserAlgorithms(LocalStorage.getItem('user'));
  } else {
    algorithms.getAll();
  }
});
</script>

<style lang="sass">
.custom-table
  background-color: transparent

.custom-table thead
  color: white

.custom-table thead tr th
  font-size: 13px !important

.custom-table .q-tr
  background-color: white

.custom-table .q-tr .q-td:first-of-type
  -webkit-border-top-left-radius: 10px
  -webkit-border-bottom-left-radius: 10px
  -moz-border-radius-topleft: 10px
  -moz-border-radius-bottomleft: 10px
  border-top-left-radius: 10px
  border-bottom-left-radius: 10px

.custom-table .q-tr .q-td:last-of-type
  -webkit-border-top-right-radius: 10px
  -webkit-border-bottom-right-radius: 10px
  -moz-border-radius-topright: 10px
  -moz-border-radius-bottomright: 10px
  border-top-right-radius: 10px
  border-bottom-right-radius: 10px

.custom-table table
  border-collapse: separate !important
  border-spacing: 0 10px !important
</style>
