import {Component, ViewEncapsulation, Input, Output, EventEmitter} from 'angular2/angular2';
import template from './navigation.html!text';
// The navigation component consists of the user area and navigation sections
import NavigationSection from './navigation-section/navigation-section.js';
import UserArea from '../user-area/user-area.js';

// This component represents the main navigation
@Component({
  selector: 'ngc-navigation',
  host: {
    'class': 'navigation'
  },
  template,
  encapsulation: ViewEncapsulation.None,
  directives: [NavigationSection, UserArea]
})
export default class Navigation {
  @Input() activeLink;
  @Input() openTasksCount;
  @Output() activeLinkChange = new EventEmitter();

  // Checks if a given navigation item is currently active by its link. This function will be called by navigation item child components.
  isItemActive(item) {
    return item.link === this.activeLink;
  }

  // If a link wants to be activated within the navigation, this function needs to be called. This way child navigation item components can activate themselves.
  activateLink(link) {
    this.activeLink = link;
    this.activeLinkChange.next(this.activeLink);
  }
}
