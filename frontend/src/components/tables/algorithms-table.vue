<template>
  <q-table
    :rows="algorithms.flowchartsList"
    :columns="columns"
    :loading="algorithms.data.loading"
    title="Algoritmos"
    :rows-per-page-options="[0]"
    row-key="name"
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

    <template v-slot:body="props">
      <q-tr
        :props="props"
        class="cursor-pointer"
        @click="editFlowchart(props.row.id, publicView ? 'public' : 'edit', publicViewInAdmin)"
      >
        <q-td :props="props" key="title">
          <div class="q-py-sm">
            <b>{{ props.row.title }}</b>
          </div>
        </q-td>

        <q-td key="user_id" :props="props">
          {{ users.getUserName(props.row.user_id) }}
        </q-td>

        <q-td key="updated_at" :props="props">
          {{ formatDatetime(props.row.updated_at) }}
        </q-td>

        <q-td
          key="action"
          :props="props"
        >
          <q-btn
            v-if="!publicView && !publicViewInAdmin"
            icon="chevron_right"
            color="primary"
            flat
            @click.stop="viewFlowchartData(props.row)"
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
import Settings from 'src/services/settings';
import Algorithms, { IAlgorithm } from 'src/services/algorithms';
import { ALGORITHMS_EDITOR, ALGORITHMS_PUBLIC_EDITOR, ALGORITHMS_SEARCH } from 'src/router/routes/algorithms';
import Users from 'src/services/users';
import { formatDatetime } from 'src/services/date';

// const componentProps = defineProps({
//   isMaintainer: {
//     type: Boolean,
//     default: false,
//   },
// });

const settings = inject('settings') as Settings;

const users = inject('users') as Users;

const algorithms = inject('algorithms') as Algorithms;

const route = useRoute();
const router = useRouter();

const publicView = computed(() => settings.isPublicView);

const publicViewInAdmin = computed(() => route.name === ALGORITHMS_SEARCH);

const columns = [
  {
    name: 'title',
    align: 'left',
    label: 'Título',
    field: 'title',
    style: 'width:40%',
  },
  {
    name: 'user_id',
    align: 'left',
    label: 'Autor',
    field: 'user_id',
    style: 'width:10%',
  },
  {
    name: 'updated_at',
    align: 'center',
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

const editFlowchart = (
  flowchartId: number,
  mode: 'edit' | 'public' = 'edit',
  fromAdmin = false,
) => {
  if (mode === 'public' && fromAdmin) {
    return router.push({
      name: ALGORITHMS_PUBLIC_EDITOR,
      query: {
        id: flowchartId,
        mode,
        from_admin: Number(fromAdmin),
      },
    });
  }

  if (mode === 'public') {
    return router.push({
      name: ALGORITHMS_PUBLIC_EDITOR,
      query: {
        id: flowchartId,
        mode,
      },
    });
  }

  return router.push({
    name: ALGORITHMS_EDITOR,
    query: {
      id: flowchartId,
      mode,
    },
  });
};

const viewFlowchartData = (flowchart: IAlgorithm) => algorithms.viewFlowchartData(flowchart);

onBeforeMount(() => {
  algorithms.getAll();
});
</script>
