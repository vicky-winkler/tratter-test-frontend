import { createRouter, createWebHashHistory } from "vue-router";

import MainModeLayout from "../components/Layouts/MainModeLayout.vue"
import LoginView from "../views/LoginView.vue"
import MainScreenView from "../views/MainScreenView.vue"
import SetupTestStationView from "../views/SetupTestStationView.vue";
import TestingSensorView from "../views/TestingSensorView.vue";
import ResultsSensorView from "../views/ResultsSensorView.vue";
import TestingBootView from "../views/TestingBootView.vue";
import TestingConditioningView from "../views/TestingConditioningView.vue";
import TestingRecalibrationView from "../views/TestingRecalibrationView.vue";
import TestingStepRecalView from "../views/TestingStepRecalView.vue";
import QualitySingleCellView from "../views/QualitySingleCellView.vue";

const routes = [
  {
    path: "/",
    component: MainModeLayout,
    children: [
      {
        path: "/",
        name: "loginView",
        component: LoginView,
        meta: {
          requiresAuth: false,
          requiresAdmin: false,
        },
      },
      {
        path: "/mainScreenView",
        name: "mainScreenView",
        component: MainScreenView,
        meta: {
          requiresAuth: true,
          requiresAdmin: false,
        },
      },
      {
        path: "/setupTestStationView",
        name: "setupTestStationView",
        component: SetupTestStationView,
        meta: {
          requiresAuth: true,
          requiresAdmin: true,
        },
      },
      {
        path: "/testingBootView",
        name: "testingBootView",
        component: TestingBootView,
        meta: {
          requiresAuth: true,
          requiresAdmin: false,
        },
      },
      {
        path: "/testingConditioningView",
        name: "testingConditioningView",
        component: TestingConditioningView,
        meta: {
          requiresAuth: true,
          requiresAdmin: false,
        },
      },
      {
        path: "/testingSensorView",
        name: "testingSensorView",
        component: TestingSensorView,
        meta: {
          requiresAuth: true,
          requiresAdmin: false,
        },
      },
      {
        path: "/testingRecalibrationView",
        name: "testingRecalibrationView",
        component: TestingRecalibrationView,
        meta: {
          requiresAuth: true,
          requiresAdmin: false,
        },
      },
      {
        path: "/testingStepRecalView",
        name: "testingStepRecalView",
        component: TestingStepRecalView,
        meta: {
          requiresAuth: true,
          requiresAdmin: false,
        },
      },
      {
        path: "/qualitySingleCellView",
        name: "qualitySingleCellView",
        component: QualitySingleCellView,
        meta: {
          requiresAuth: true,
          requiresAdmin: true,
        },
      },
      {
        path: "/resultsSensorView",
        name: "resultsSensorView",
        component: ResultsSensorView,
        meta: {
          requiresAuth: true,
          requiresAdmin: false,
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      if (to.meta.requiresAdmin) {
        const adminToken = localStorage.getItem("adminToken");
        if (adminToken) {
          next();
        } else {
          next("/");
        }
      } else {
        next();
      }
    } else {
      next("/");
    }
  } else {
    next();
  }
});

export default router;