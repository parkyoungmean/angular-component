import {Component, Input, Output, EventEmitter, ViewEncapsulation, ChangeDetectionStrategy} from 'angular2/angular2';
import template from './task.html!text';
// Each task has a checkbox component for marking tasks as done.
import Checkbox from '../../ui/checkbox/checkbox.js';

@Component({
  selector: 'ngc-task',
  host: {
    'class': 'task',
    // Host property binding to set a class task--done on the host element if our task model says that the task is done.
    '[class.task--done]': 'done'
  },
  template,
  encapsulation: ViewEncapsulation.None,
  directives: [Checkbox],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class Task {
  @Input() title;
  @Input() done;
  // We are using two event emitters for task updates and deletion
  @Output() taskUpdated = new EventEmitter();
  @Output() taskDeleted = new EventEmitter();

  // We use this function to update the checked state of our task
  markDone(checked) {
    this.done = checked;
    this.taskUpdated.next({
      title: this.title,
      done: this.done
    });
  }

  // If we want to delete this task we just emit an event and let the parent component deal with the rest
  deleteTask() {
    this.taskDeleted.next();
  }
}
