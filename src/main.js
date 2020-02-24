import Vue from "vue";
import Vuelidate from "vuelidate";
import Paginate from 'vuejs-paginate'
import App from "./App.vue";
import router from "./router";
import store from "./store";
import dateFilter from "./filters/date.filter";
import currencyFilter from "./filters/currency.filter";
import tooltipDirective from "./directives/tooltip.directive";
import messagePlugin from "./utils/message.plugin";
import Loader from "./components/app/Loader.vue";
import "./registerServiceWorker";
import "materialize-css/dist/js/materialize.min";

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

Vue.config.productionTip = false;

Vue.use(messagePlugin);
Vue.use(Vuelidate);
Vue.component("Loader", Loader);
Vue.component('paginate', Paginate);
Vue.directive("tooltip", tooltipDirective);
Vue.filter("date", dateFilter);
Vue.filter("currency", currencyFilter);

firebase.initializeApp({
  apiKey: "AIzaSyCocEmsXZ-6-ZoYSiCX7dNfyqfesZ08w1E",
  authDomain: "di-vue-lessons.firebaseapp.com",
  databaseURL: "https://di-vue-lessons.firebaseio.com",
  projectId: "di-vue-lessons",
  storageBucket: "di-vue-lessons.appspot.com",
  messagingSenderId: "239497055590",
  appId: "1:239497055590:web:215c60996e7431d2bb4ca7",
  measurementId: "G-TCG342SVHD"
});

let app;
firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount("#app");
  }
});
