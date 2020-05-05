import express from 'express';

const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

app.set('views', __dirname);
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Route files
const index = require('./Routes/index');
const traduccion = require('./Routes/traduccion');

// Mount routers
app.use('/traduccion', traduccion);
app.use('/', index);

app.listen(Number(port), _ => {
    return console.log(`server is listening on ${port}`);
});