﻿ System.config({
  baseURL: '<%= APP_BASE %>',
  paths: {'*': '*.js?v=<%= VERSION %>'}
});

System.import('app')
  .catch(e => console.error(e));
