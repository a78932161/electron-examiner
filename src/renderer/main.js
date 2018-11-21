import Vue from 'vue'
import axios from 'axios'

import App from './App'
import {db,db1,psw,title,setting,labData,imgData} from './datastore';
import router from './router'
import store from './store'
import 'underscore/underscore-min';


if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.http = Vue.prototype.$http = axios;
Vue.prototype.$db = db;
Vue.prototype.$db1 = db1;
Vue.prototype.$db2 = psw;
Vue.prototype.$db3 = title;
Vue.prototype.$db4 = setting;
Vue.prototype.$db5 = labData;
Vue.prototype.$db6 = imgData;

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app');
