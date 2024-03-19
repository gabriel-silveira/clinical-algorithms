import { RouteRecordRaw } from 'vue-router';
import Account from './routes/account';
import Home from './routes/home';
import Users from './routes/users';
import AlgorithmsCategories from './routes/algorithms_categories';

import Algorithms, { ALGORITHMS_PUBLIC_PRINT, ALGORITHMS_PUBLIC_PRINT_PATH } from './routes/algorithms';

const routes: RouteRecordRaw[] = [
  // {
  //   path: '',
  //   component: () => import('layouts/main-layout.vue'),
  //   children: [],
  // },
  {
    path: '',
    component: () => import('layouts/main-layout.vue'),
    children: [
      ...Home,
      ...Users,
      ...Algorithms,
      ...AlgorithmsCategories,
    ],
  },
  {
    path: '/admin',
    component: () => import('layouts/login-layout.vue'),
    children: [
      ...Account,
      {
        path: ALGORITHMS_PUBLIC_PRINT_PATH,
        name: ALGORITHMS_PUBLIC_PRINT,
        component: () => import('pages/editor/print-page.vue'),
      },
    ],
  },
];

export default routes;
