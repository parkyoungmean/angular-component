import {Component, Input, Inject, ViewEncapsulation, Output, EventEmitter, ChangeDetectionStrategy} from 'angular2/angular2';
import template from './project.html!text';
import Tabs from '../ui/tabs/tabs.js';
import Tab from '../ui/tabs/tab/tab.js';
import TaskList from '../task-list/task-list.js';

// This component represents a project and displays project details
@Component({
  selector: 'ngc-project',
  host: {
    'class': 'project'
  },
  template,
  encapsulation: ViewEncapsulation.None,
  directives: [Tabs, Tab, TaskList],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class Project {
  @Input() title;
  @Input() description;
  @Input() tasks;
  @Output() projectUpdated = new EventEmitter();

  // This function emits an event if any of the project details have been changes within the component
  onProjectUpdated() {
    this.projectUpdated.next({
      title: this.title,
      description: this.description,
      tasks: this.tasks
    });
  }

  // This function should be called if the task list of the project was updated
  updateTasks(tasks) {
    this.tasks = tasks;
    this.onProjectUpdated();
  }
}
