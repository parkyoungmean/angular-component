import {Component, Input, ViewEncapsulation} from 'angular2/angular2';
import template from './tab.html!text';

@Component({
  selector: 'ngc-tab',
  host: {
    'class': 'tabs__tab',
    // We control the active class of the tab with the internal active flag and this host property binding
    '[class.tabs__tab--active]': 'active'
  },
  template,
  encapsulation: ViewEncapsulation.None
})
export default class Tab {
  @Input() name;
  active = false;
}
