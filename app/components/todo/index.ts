import { Component, View, Inject, Optional} from 'angular2/angular2';
import {RouteConfig, RouterOutlet, RouterLink, routerInjectables} from 'angular2/router';
import { FormBuilder, ControlGroup, NgModel, NgControl, formDirectives} from 'angular2/angular2';
import {Validators} from 'angular2/angular2';
import {TodoList} from 'components/todo/list';
import {TodoService} from 'services/todoService';

@Component({
    selector: 'component-1',
    hostInjector: [TodoService],
})

@View({
    templateUrl: './components/todo/index.html?v=<%= VERSION %>',
    directives: [RouterLink, TodoList, formDirectives]
})

export class Todo
{    
    todoService: TodoService;
    todoList: TodoList;
    todo: { title: string, description: string };

    constructor(service: TodoService)
    {  
        this.todo = {
            title: '',
            description: ''
        };        
        this.todoList = new TodoList(service);
        this.todoService = service;
    }

    addTodo(title, description)
    {
        this.todoService.addTodo({
            title: this.todo.title,
            description: this.todo.description
        });

        this.todo.title = '';
        this.todo.description = '';

        this.todoList.getTodoList();
    }
}
 