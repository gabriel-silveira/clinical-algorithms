<template>
  <q-card class="shadow-light q-my-lg">
    <q-card-section
      class="search-result-item"
    >
      <q-list separator>
        <q-item
          clickable
          v-ripple
          @click="goEditor(result.id, null)"
        >
          <div
            class="text-body1"
            style="margin-top:5px"
            v-html="`<b>Algoritmo:</b> ${highlightSearchKeyword(result.title, keyword)}`"
          />
        </q-item>
      </q-list>

      <q-list separator>
        <q-item
          v-for="node of result.nodes"
          :key="`node-${node.id}`"
          clickable
          v-ripple
          @click="goEditor(result.id, node)"
        >
          <div
            v-html="`<b>Nodo:</b> ${highlightSearchKeyword(node.label, keyword)}`"
            class="q-pl-lg q-mt-sm"
          />
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { highlightSearchKeyword } from 'src/services/texts';
import { IAlgorithmThoroughSearchResultItem, INode } from 'src/services/algorithms';
import { PropType } from 'vue';
import { ALGORITHMS_EDITOR, ALGORITHMS_PUBLIC_EDITOR, ALGORITHMS_PUBLIC_SEARCH } from 'src/router/routes/algorithms';
import { useRoute, useRouter } from 'vue-router';
import Editor from 'src/services/editor';

const route = useRoute();
const router = useRouter();

const props = defineProps({
  keyword: {
    type: String,
    required: true,
  },
  result: {
    type: Object as PropType<IAlgorithmThoroughSearchResultItem>,
    required: true,
  },
});

const goEditor = (algorithmId: number, node: INode | null) => {
  const name = route.name === ALGORITHMS_PUBLIC_SEARCH
    ? ALGORITHMS_PUBLIC_EDITOR : ALGORITHMS_EDITOR;

  if (node) {
    Editor.preview(node.algorithm_id, `&node=${node.node_id}&search=${props.keyword}`);

    /* router.push({
      name,
      query: {
        id: node.algorithm_id,
        mode: 'public',
        node: node.node_id,
        search: props.keyword,
      },
    }); */
  } else if (algorithmId) {
    router.push({
      name,
      query: {
        id: algorithmId,
        mode: 'public',
        search: props.keyword,
      },
    });
  }
};
</script>
