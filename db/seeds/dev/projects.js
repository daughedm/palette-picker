exports.seed = function (knex, Promise) {
  // We must return a Promise from within our seed function
  // Without this initial `return` statement, the seed execution
  // will end before the asynchronous tasks have completed
  return knex('palettes').del() // delete all footnotes first
    .then(() => knex('projects').del()) // delete all papers

    // Now that we have a clean slate, we can re-insert our paper data
    .then(() => {
      return Promise.all([

        // Insert a single paper, return the paper ID, insert 2 footnotes
        knex('projects').insert({
          name: 'Cool Thing'
        }, 'id')
        .then(project => {
          return knex('palettes').insert([
            {
              name: 'Default Palette',
              colorOne: '#A0D468',
              colorTwo: '#48CFAD',
              colorThree: '#4FC2E9',
              colorFour: '#5D9CEC',
              colorFive: '#AC92EB',
              project_id: project[0]
            }
          ])
        })
        .then(() => console.log('Seeding complete!'))
        .catch(error => console.log(`Error seeding data: ${error}`))
      ]) // end return Promise.all
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};