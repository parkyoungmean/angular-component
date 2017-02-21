export default function initialize(db) {
  console.log('Initializing Angular 2 Components database');
  return fetch('/data-access/initial-data.json')
    .then(response => response.json())
    .then(data => {
      return Promise.all(data.map(document => db.put(document)));
    })
    .then((_) => db.info())
    .then(info => {
      console.log(`Successfully initialized database with ${info.doc_count} documents`);
    })
    .catch(error => {
      console.error('Error while inserting initial data. Please evaluate the error message and contact author if the error is persistent.');
      throw error;
    });
}
