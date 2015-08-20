import {Component, OnInit, Directive, View, Inject, NgFor, NgIf, OnChange, AppRootUrl} from 'angular2/angular2';

import {Location} from 'angular2/router';
import {TodoDetails} from 'components/todo/details';
import {TodoService} from 'services/todoService';

@Component({
    selector: 'todo-list',
    viewInjector: [TodoService]
})

@View({
    templateUrl: './components/todo/list.html?v=<%= VERSION %>',
    directives: [NgFor, NgIf]
})

export class TodoList
{
    
    todos: Array<Object>;
    todoService: TodoService;   

    constructor(service: TodoService)
    {       
        this.todos = [];
        this.todoService = service;        
    }
    
    getTodoList()
    {   
        this.todos = [];
                          
        this.todoService.getTodos().then((response) =>
        {
            this.todos = response;
        });
    }

    getDetails(event, id)
    {
        new Location().go('/todo/details/' + id);
        debugger;
    }

    removeTodo(event, id)
    {
        this.todoService.removeTodo(id);
        this.getTodoList();
    }  
    
    onInit()
    {
        this.getTodoList();
    } 

    onChange()
    {
        this.getTodoList();
    }
}
  