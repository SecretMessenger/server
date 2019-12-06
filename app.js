if (process.env.NODE_ENV === 'development'){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const PORT = process.env.PORT;
const mongoURI = process.env.MONGO_URI;
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes');
const morgan = require('morgan');
const { errorHandler } = require('./middlewares/errorHandler');

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());

mongoose
    .connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then(_ => console.log('connected to database.'))
    .catch(_ => console.log('database connection failed.'));
    

app.use(morgan('dev'));
app.use('/', routes);

app.use((req, res, next) => {
    const err = {
        msg: 'Not Found.',
        status: 404
    }
    next(err);
})

app.use(errorHandler);

app.listen(PORT, () => console.log(`listening on port PORT`));

module.exports = app