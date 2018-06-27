const express = require('express') //imports express
const app = express() //creates an instance of express
const bodyParser = require('body-parser') //not sure yet
const environment = process.env.NODE_ENV || 'development' //not sure
const configuration = require('./knexfile')[environment] //grabs correct knexfile
const database = require('knex')(configuration)

const useHttps = (request, response, next) => {
  if (request.headers['x-forwarded-proto'] !== 'https') {
    response.redirect('https://' + request.get('host') + request.url);
  }
  next();
};

app.use(express.static('public'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'production') {
  app.use(useHttps);
}


app.set('port', process.env.PORT || 3000);

app.locals.title = 'Palette-Picker';

// gets
app.get('/api/v1/projects', (request, response) => {
  database('projects')
    .select()
    .then((projects) => {
      response.status(200).json(projects);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/palettes', (request, response) => {
  database('palettes')
    .select()
    .then((palette) => {
      response.status(200).json(palette);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/projects/:id/palettes', (request, response) => {
  const { id } = request.params

  database('palettes').where("project_id", id)
    .select()
    .then(palettes => {
      if (!palettes.length) {
        return response.status(404).json({
          error: 'Sorry, no palettes could be found'
        })
      }
      response.status(200).json(palettes)
    })
    .catch(error => {
      response.status(500).json({ error })
    })
})

// posts

app.post('/api/v1/projects', (request, response) => {
  const {project} = request.body
  database('projects').insert(project, 'id')
    .then((projectId) => {
      response.status(201).json({projectId: projectId[0]});
    })
    .catch((error) => {
      response.status(500).json({
        error
      });
    });
});

app.post('/api/v1/palettes', (request, response) => {
  const palette = request.body;
  
    if(!palette.name) {
      return response.status(422).send({ 
        error: `Expected format: { name: <String>, colorOne: <String> , colorTwo: <String>, colorThree: <String>, colorFour: <String>, colorFive: <String>, project_id: <Number> }.`
      });
  };
  database('palettes').insert(palette, 'id')
    .then(palettes => response.status(201).json({ id: palettes[0] }))
    .catch(error => response.status(500).json({ error }));
});


app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;