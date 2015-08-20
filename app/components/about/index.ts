import {Component, View} from 'angular2/angular2';

@Component({
    selector: 'component-2'
})
@View({
    templateUrl: './components/about/about.html?v=<%= VERSION %>'
})

export class About
{
    
}
