import {Component, NgFor, ViewEncapsulation, Input, Output, EventEmitter, ChangeDetectionStrategy} from 'angular2/angular2';
import template from './task-list.html!text';
import Task from './task/task.js';
import EnterTask from './enter-task/enter-task.js';
import Toggle from '../ui/toggle/toggle.js';

@Component({
  selector: 'ngc-task-list',
  host: {
    'class': 'task-list'
  },
  template,
  encapsulation: ViewEncapsulation.None,
  directives: [Task, EnterTask, Toggle, NgFor],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class TaskList {
  @Input() tasks;
  // Event emitter for emitting an event once the task list has been changed
  @Output() tasksUpdated = new EventEmitter();

  constructor() {
    this.taskFilterList = ['all', 'open', 'done'];
    this.selectedTaskFilter = 'all';
  }

  // Get a filtered list of the task list that depends on our selected filter
  getFilteredTasks() {
    return this.tasks.filter((task) => {
      if (this.selectedTaskFilter === 'all') {
        return true;
      } else if (this.selectedTaskFilter === 'open') {
        return !task.done;
      } else {
        return task.done;
      }
    });
  }

  // We use the reference of the old task to updated one specific item within the task list.
  onTaskUpdated(task, taskData) {
    const tasks = this.tasks.slice();
    tasks.splice(this.tasks.indexOf(task), 1, taskData);
    this.tasksUpdated.next(tasks);
  }

  // Using the reference of a task, this function will remove it from the tasks list and send an update
  onTaskDeleted(task) {
    const tasks = this.tasks.slice();
    tasks.splice(this.tasks.indexOf(task), 1);
    this.tasksUpdated.next(tasks);
  }

  // Function to add a new task
  addTask(title) {
    const tasks = this.tasks.slice();
    tasks.splice(this.tasks.length, 0, {
      title,
      done: false
    });
    this.tasksUpdated.next(tasks);
  }
}
