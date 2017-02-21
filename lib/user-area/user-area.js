import {Component, ViewEncapsulation, Inject, Input, NgIf} from 'angular2/angular2';
import template from './user-area.html!text';

// This component represents the user area above the main navigation
@Component({
  selector: 'ngc-user-area',
  host: {
    'class': 'user-area'
  },
  template,
  encapsulation: ViewEncapsulation.None,
  directives: [NgIf]
})
export default class UserArea {
  @Input() openTasksCount;
}
