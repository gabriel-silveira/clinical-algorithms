<template>
  <q-page class="bg-grey-1" padding>
    <div class="row q-mb-md">
      <div class="col-12 text-right">
        <q-btn
          label="Registrar categoría"
          color="primary"
          push
          @click="startCreatingCategory"
        />
      </div>
    </div>

    <algorithms-categories-table />

    <edit-algorithm-category-modal />
  </q-page>
</template>

<script setup lang="ts">
import AlgorithmsCategoriesTable from 'components/tables/algorithms-categories-table.vue';
import EditAlgorithmCategoryModal from 'components/modals/algorithms/edit-algorithm-category-modal.vue';
import AlgorithmsCategories from 'src/services/algorithms-categories';
import { inject, onBeforeMount, provide } from 'vue';
import Settings from 'src/services/settings';
import { HOME } from 'src/router/routes/home';
import { useRouter } from 'vue-router';

const settings = inject('settings') as Settings;

const router = useRouter();

const algorithmsCategories = new AlgorithmsCategories();

provide('algorithmsCategories', algorithmsCategories);

const startCreatingCategory = () => {
  algorithmsCategories.toggleEditDialog(true);
};

onBeforeMount(async () => {
  if (!await Settings.isMaster()) {
    await router.push({
      name: HOME,
    });
  }

  settings.page.setTitle('Mantenimiento de categorías');
});
</script>
