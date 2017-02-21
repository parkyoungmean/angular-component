import {Component, ViewEncapsulation, ContentChildren, NgFor} from 'angular2/angular2';
import template from './tabs.html!text';
// We rely on the tab component
import Tab from './tab/tab.js';

@Component({
  selector: 'ngc-tabs',
  host: {
    'class': 'tabs'
  },
  template,
  encapsulation: ViewEncapsulation.None,
  directives: [NgFor, Tab]
})
export default class Tabs {
  // This queries the content inside <ng-content> and stores a query list that will be updated if the content changes
  @ContentChildren(Tab) tabs;

  // The afterContentInit lifecycle hook will be called once the content inside <ng-content> was initialized
  afterContentInit() {
    this.activateTab(this.tabs.first);
  }

  activateTab(tab) {
    // To activate a tab we first convert the live list to an array and deactivate all tabs before we set the new tab active
    this.tabs.toArray().forEach((t) => t.active = false);
    tab.active = true;
  }
}
