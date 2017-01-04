import angular from 'angular';
import components from './components';
import services from './services';

import satellizer from 'satellizer';
import oauth from './auth/oauth';

import uiRouter from 'angular-ui-router';
import 'angular-ui-router/release/stateEvents';

import dialog from 'ng-dialog';
import 'ng-dialog/css/ngDialog.css';
import 'ng-dialog/css/ngDialog-theme-default.css';

import routes from './routes';
import http from './auth/http';
import auth from './auth/auth';

const app = angular.module('TechFolio', [
  components,
  services, 
  uiRouter,
  dialog,
  angular.module('ui.router.state.events').name,
  satellizer
]);

app.constant('apiUrl', 'http://localhost:3500');
app.value('ghUrl', 'http://api.github.com');

app.config(oauth);
app.config(http);
app.config(routes);

app.run(auth);