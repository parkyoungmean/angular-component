import {Injectable, Inject} from 'angular2/angular2';
import {NgZone} from 'angular2/src/core/zone/ng_zone';

import {Observable} from '@reactivex/rxjs/dist/cjs/Rx.js';
import PouchDB from 'pouchdb';

import initialize from './initialize.js';

@Injectable()
export default class DataProvider {
  constructor(@Inject(NgZone) zone) {
    this.zone = zone;
    this.db = new PouchDB('angular-2-components');
    this.initialized = this.db.info().then(info => this.zone.run(() => {
      if (info.doc_count === 0) {
        return initialize(this.db);
      } else {
        console.log(`Found existing database with ${info.doc_count} documents.`);
      }
    })).catch(error => this.zone.run(() => {
      console.error('Could not initialize database. Please check the browser compatibility notes within the Angular 2 Components book.');
      throw error;
    }));
  }

  getDatabase() {
    return this.initialized.then(() => this.db);
  }

  getChanges(config) {
    return Observable.create((observer) => {
      const changes = this.db.changes(config)
        .on('change', (change) => this.zone.run(() => observer.next(change)))
        .on('error', (error) => this.zone.run(() => observer.error(error)))
        .on('complete', () => this.zone.run(() => observer.complete()));

      return function () {
        changes.cancel();
      };
    });
  }

  getLiveChanges(sinceNow = false) {
    return this.getChanges({ since: sinceNow ? 'now' : 0, live: true, include_docs: true });
  }

  getAllChanges() {
    return this.getChanges({ since: 0, include_docs: true });
  }

  getDocuments(key) {
    return this.initialized.then(() => {
      if (key instanceof Array) {
        const [startKey, endKey] = key;

        return this.db.allDocs({
          include_docs: true,
          attachments: true,
          startkey: startKey,
          endkey: endKey
        }).then(result => this.zone.run(() => result.rows.map(row => row.doc)));

      } else {
        return db.get(key).then(result => this.zone.run(() => result));
      }
    });
  }

  createOrUpdateDocument(document) {
    return this.initialized.then(() => {
      return this.db.put(document)
        .then((response) => this.zone.run(() => response))
        .catch(error => this.zone.run(() => { throw error }));
    });
  }
}
