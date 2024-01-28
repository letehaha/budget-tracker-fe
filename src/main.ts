import { createApp } from "vue";
import { VueQueryPlugin } from "@tanstack/vue-query";
import { router } from "@/routes";
import { clickOutside, nodeResizeObserver } from "@/directives";
import { store } from "@/stores/setup";
import {
  identifyCurrentTheme,
  patchMetaViewportMaxScaleForiOS,
} from "@/common/utils";
import App from "./app.vue";
import "@/styles/index.scss";
import "./registerServiceWorker";

identifyCurrentTheme();
patchMetaViewportMaxScaleForiOS();

const app = createApp(App);

app.directive("click-outside", clickOutside);
app.directive("node-resize-observer", nodeResizeObserver);

app.use(router);
app.use(store);

app.use(VueQueryPlugin);

app.mount("#app");
