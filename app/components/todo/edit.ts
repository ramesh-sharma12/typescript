import {Component, View} from 'angular2/angular2';
import {RouterLink} from 'angular2/router';

@Component({
    selector: 'component-1'
})
@View({
    templateUrl: './components/todo/edit.html?v=<%= VERSION %>',
    directives: [RouterLink]
})

export class TodoEdit
{
    todo: Object;

    constructor()
    {
        this.todo = {
            title: 'old title',
            description: 'old description'
        }
    }
    getTodoDetails()
    {
        return {};
    }

    saveTodo()
    {

    }
}
  