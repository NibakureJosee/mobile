const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const app = express();
const port = process.env.PORT || 5000;
const swaggerDocument = require('./swagger.json');

const swaggerSpecification = swaggerJsdoc(swaggerDocument);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecification));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Define CORS options to restrict access to specific origins if needed
app.use(cors());

app.set('port', port);

require('./src/routes/auth.router')(app);
require('./src/routes/candidate.router')(app);

// Update Mongoose connection
mongoose.connect(process.env.DB_URL)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

app.get('/', (req, res) => {
  res.json("Welcome to the API");
});

const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); //setting the default folder for multer

// Upload route
app.post('/upload', upload.single('fileData'), (req, res, next) => {
  console.log(req.file); //this will be automatically set by multer
  console.log(req.body);

  // Read the uploaded file
  fs.readFile(req.file.path, (err, contents) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(500).send('Error reading file');
    } else {
      console.log('File contents:', contents);
      res.send('File uploaded and read successfully');
    }
  });
});
