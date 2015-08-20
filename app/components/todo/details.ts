import {Component, View} from 'angular2/angular2';
import {RouterLink} from 'angular2/router';

@Component({
    selector: 'todo-details'
})
@View({
    templateUrl: './components/todo/details.html?v=<%= VERSION %>',
    directives: [RouterLink]
})

export class TodoDetails
{
    todo: Object;

    constructor()
    {
        this.todo = {
            title: 'testing',
            description: 'this is a testing task',
            createDate: this.formatDateTime(new Date())
        }
    }

    getTodoDetails()
    {
        this.todo = {
            title: 'testing',
            description: 'this is a testing task',
            createDate: this.formatDateTime(new Date())
        }
    }

    formatDateTime(date)
    {
        return date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
    }

    editTodo(id)
    {
        window.location.href = '/todo/edit/' + id;
    }
}
  