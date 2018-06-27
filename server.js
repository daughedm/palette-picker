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


app.set('port', process.env.PORT || 3000); //creates port at localhost 3000

app.locals.title = 'Palette Picker';

app.get('/', (request, response) => {
  response.send('Hello World!');
});

app.get('/api/v1/projects', (request, response) => {
  database('projects')
    .select()
    .then((projects) => {
      response.status(200).json(projects);
    })
    .catch((error) => {
      response.status(500).json({
        error
      });
    });
});

app.get('/api/v1/palettes', (request, response) => {
  database('palettes')
    .select()
    .then((palette) => {
      response.status(200).json(palette);
    })
    .catch((error) => {
      response.status(500).json({
        error
      });
    });
});




app.get('/api/v1/messages/:id', (request, response) => {
  const { id } = request.params;
  const message = app.locals.messages.find(message => message.id === id);
  if (message) {
    return response.status(200).json(message);
  } else {
    return response.sendStatus(404);
  }
});

app.post('/api/v1/messages', (request, response) => {
  const { message } = request.body;
  const id = Date.now();

  if (!message) {
    return response.status(422).send({
      error: 'No message property provided'
    });
  } else {
    app.locals.messages.push({ id, message });
    return response.status(201).json({ id, message });
  }
})

// app.delete('/api/v1/messages/:id', (request, response) {
//   const { id } = request.params;
//   response.send('DELETE request to homepage');
// });

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

app.use(express.static('public'));