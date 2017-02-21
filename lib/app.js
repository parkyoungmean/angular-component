import {Component, ViewEncapsulation, Inject, NgIf} from 'angular2/angular2';
import DataProvider from '../data-access/data-provider.js';
import template from './app.html!text';
import Project from './project/project.js';
import Navigation from './navigation/navigation.js';
import NavigationSection from './navigation/navigation-section/navigation-section.js';
import NavigationItem from './navigation/navigation-section/navigation-item/navigation-item.js';

// Helper class to convert URIs to project ID's and to generate link item models from projects
class LinkConverter {
  static getIdFromLink(link) {
    return link.slice(1);
  }

  static getItemModelFromProject(project) {
    return project ? {
      title: project.title,
      link: `#${project._id}`
    } : {
      title: '',
      link: '#'
    };
  }
}

// Our main application component will be responsible for fetching project data and rendering the main application components.
@Component({
  selector: 'ngc-app',
  template,
  encapsulation: ViewEncapsulation.None,
  directives: [Project, Navigation, NavigationSection, NavigationItem, NgIf],
  providers: [DataProvider]
})
export default class App {
  // We use the data provider to obtain a data change observer
  constructor(@Inject(DataProvider) dataProvider) {
    this.dataProvider = dataProvider;
    this.projects = [];
    // To avoid reference problems, we are using a index to identify the selected project
    this.selectedProjectIndex = 0;

    // Setting up our functional reactive subscription to receive project changes from the database
    this.projectsSubscription = this.dataProvider.getLiveChanges()
      // First convert the change records to actual documents
      .map((change) => change.doc)
      // Filter so that we only receive project documents
      .filter((document) => document.type === 'project')
      // Finally we subscribe to the change observer and deal with project changes in the function parameter
      .subscribe((changedProject) => {
        // On every project change we need to update our projects list as well as sort it by title
        const projectIndex = this.projects.findIndex((project) => project._id === changedProject._id);
        if (projectIndex === -1) {
          this.projects.push(changedProject);
        } else {
          this.projects.splice(projectIndex, 1, changedProject);
        }
        this.projects.sort((a, b) => a.title > b.title ? 1 : a.title < b.title ? -1 : 0);
      });
  }

  // This function uses the link converted to create navigation link models from all projects that are not deleted
  getProjectNavigationItems() {
    return this.projects.filter((project) => !project.deleted)
      .map((project) => LinkConverter.getItemModelFromProject(project));
  }

  // Uses functional reduce to get a count over open tasks across all projects
  getOpenTasksCount() {
    return this.projects.reduce((count, project) => count + project.tasks.filter((task) => !task.done).length, 0);
  }

  // Getting the selected project based on the selected index
  getSelectedProject() {
    return this.projects[this.selectedProjectIndex];
  }

  // Uses the link converted to generate the link identifier of the currently selected project
  getSelectedProjectLink() {
    return LinkConverter.getItemModelFromProject(this.getSelectedProject()).link;
  }

  // This function will set the selectedProjectIndex based on a link identifier
  selectProjectByLink(link) {
    this.selectedProjectIndex = this.projects.findIndex((project) => project._id === LinkConverter.getIdFromLink(link));
  }

  // This function updates the selected project data with the data provided as parameter and then persists the changes to the database.
  updateSelectedProject(projectData) {
    const selectedProject = this.getSelectedProject();
    Object.assign(selectedProject, projectData);
    this.dataProvider.createOrUpdateDocument(selectedProject);
  }

  // If this component gets destroyed, we need to remember to clean up the project subscription
  onDestroy() {
    this.projectsSubscription.unsubscribe();
  }
}
