import Vue from 'vue'
import Router from 'vue-router'


let mode = (process.env.NODE_ENV === 'development') ? 'development' : 'production';

const _import = require('./_import_' + mode);
Vue.use(Router);
//
// const constantRouterMap = [
//     {path: '/', redirect: '/home'},
//     {path: '/examiner', component: _import('examiner/index/index')},
//     {path: '/examinee', component: _import('examinee/index/index')},
//     {path: '/rule', component: _import('examiner/index/rule')},
//     {path: '/site', component: _import('examiner/site/index')},
//     {path: '/login', component: _import('examiner/site/login')},
//     {path: '/import', component: _import('examiner/site/import')},
//     {path: '/setLabel', component: _import('examiner/site/setLabel')},
//     {path: '/home', component: _import('examiner/site/home')},
//
// ];


export default new Router({
    // mode:'history',
    scrollBehavior: () => ({y: 0}),
    routes: [{path: '/', redirect: '/homeImg'},
        {path: '/examiner', component: _import('examiner/index/index')},
        {path: '/examinee', component: _import('examinee/index/index')},
        {path: '/rule', component: _import('examiner/site/rule')},
        {path: '/homeData', component: _import('examiner/site/homeData')},
        {path: '/login', component: _import('examiner/site/login')},
        {
            path: '/home', component: _import('examiner/site/home'), children: [
                {path: '/homeEnd', component: _import('examiner/site/homeEnd')},
                {path: '/homeImg', component: _import('examiner/site/homeImg')},
                {path: '/transition', component: _import('examiner/site/transition')},
            ]
        },

        {
            path: '/site', component: _import('examiner/site/index'), children: [
                {path: '/import', component: _import('examiner/site/import')},
                {path: '/setLabel', component: _import('examiner/site/setLabel')},
                {path: '/other', component: _import('examiner/site/other')},
                {path: '/upPsw', component: _import('examiner/site/upPsw')},
                {path: '/upTitle', component: _import('examiner/site/upTitle')},
                {path: '/upBackground', component: _import('examiner/site/upBackground')},
                {path: '/upOk', component: _import('examiner/site/upOk')},
            ]
        },
    ]
})
