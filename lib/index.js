'use strict';

const ioa = require('ioa');
const app = require('@app');
const T = require('ttools');

const { NODE_ENV, components } = ioa;

const contain = ['default.js', `${NODE_ENV}.js`];

app.emit('loads', {
   "config": {
      "level": 10,
      before(options) {
         const filter = [];
         const { dirList } = options;
         for (const item of contain) {
            if (dirList.includes(item)) {
               filter.push(item);
            }
         }
         options.dirList = filter;
      },
      /**
       * 环境配置合并
       * @param {object} data 
       */
      directory(data) {

         const config = { ...data.default };

         const envConfig = data[NODE_ENV];

         // 与环境变量配置合并
         if (envConfig) {
            T(config).object({ mixin: envConfig })
         }

         return config;

      },
      /**
       * 将main.config中的组件配置项混入到对应的app中
       */
      after({ root }) {

         if (root !== ioa.main) return;

         const { config } = root;

         if (config === undefined) return;

         for (const name in components) {

            const appConfig = config[name];

            if (appConfig) {

               const component = components[name];

               if (component.config) {
                  T(component.config).object({ mixin: mixinConfig });
               } else {
                  component.config = appConfig;
               }

            }

         }

      }
   }
});