const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const route = require('./routes');
dotenv.config();
const port = process.env.PORT || 4000;
const app = express();
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb", parameterLimit: 50000 }));
app.use(bodyParser.json({ extended: true, limit: "50mb" }));
app.use(cors());
app.use(morgan("dev"));
route(app)
app.listen(port, () => console.log(`Server started at http://localhost:${port}`));