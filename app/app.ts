import {Component, View, bootstrap, AppRootUrl} from 'angular2/angular2';
import {RouteConfig, RouterOutlet, RouterLink, routerInjectables} from 'angular2/router';


import {Home} from './components/home/index';
import {About} from './components/about/index';
import {Todo} from './components/todo/index';
import {TodoList} from './components/todo/list';
import {TodoDetails} from './components/todo/details';
import {TodoEdit} from './components/todo/edit';

@Component({
    selector: 'app'
})

@RouteConfig([
  { path: '/', component: Home, as: 'home' },
  { path: '/home', component: Home, as: 'home' },
  { path: '/about', component: About, as: 'about' },
  { path: '/todo', component: Todo, as: 'todo' },
  { path: '/todo/list', component: TodoList, as: 'list' },
  { path: '/todo/edit/:id', component: TodoEdit, as: 'edit' },
  { path: '/todo/details/:id', component: TodoDetails, as: 'details' }
])

@View({
  templateUrl: './app.html?v=<%= VERSION %>',
  directives: [RouterOutlet, RouterLink]
})

class App {}

bootstrap(App, [routerInjectables]);
