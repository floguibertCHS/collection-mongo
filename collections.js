const express = require('express');
const mustache = require('mustache-express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost:27017/coinsdb');

const Coins = require('./models/coins');

const application = express();

application.set('views', '/views');
application.set('view engine', 'mustache-express');

application.engine('mustache', mustache());
application.set('views', './views');
application.set('view engine', 'mustache');


application.use('/public', express.static('./public'));
application.use(bodyParser.urlencoded({ extended: false}));
application.use(bodyParser.json());

//INDEX///
application.get('/', async (request, response) => {
    var coins = await Coins.find();
    var model = {coins: coins};
    console.log('in the get');
    response.render('index', model)
});
application.post('/', (request, response) => {
    var newCoin = {
        name: request.body.name,
        year: request.body.year,
        location: {
            city: request.body.city,
            state: request.body.state,},
        color: request.body.color
        }
        console.log('in the post');
    Coins.create(newCoin);
    response.redirect('/');
})
///VIEW///
application.get('/:id', async(request, response) => {
    var id = request.params.id;
    var coin = await Coins.find({_id:id});
    var model = {coin: coin, id:id};
    
    response.render('view', model);
});
///EDIT///
application.get('/edit/:id', async(request, response) => {
    var id = request.params.id;
    var coin = await Coins.find({_id:id});
    var model = {coin: coin, id:id};
    
response.render('edit', model);
});

application.post('/edit/:id', async(request, response) => {
    var id = request.params.id;

    await Coins.findOneAndUpdate({_id:id},
    {
        name: request.body.name,
        year: request.body.year,
        location: {
            city: request.body.city,
            state: request.body.state,
        },
        color: request.body.color
    })
        console.log(request.body);

        response.redirect('/')
});

application.post('/delete/:id', async (request, response) => {
    await Coins.deleteOne({_id: request.params.id})
    
    console.log(request.params.id);
    response.redirect('/');
});
console.log('app started')
application.listen(3000);