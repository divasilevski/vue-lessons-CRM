import Vue from "vue";
import Vuelidate from "vuelidate";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import dateFilter from "./filters/date.filter";
import messagePlugin from "./utils/message.plugin";
import "./registerServiceWorker";
import "materialize-css/dist/js/materialize.min";

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

Vue.config.productionTip = false;

Vue.use(messagePlugin);
Vue.use(Vuelidate);
Vue.filter("date", dateFilter);

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
