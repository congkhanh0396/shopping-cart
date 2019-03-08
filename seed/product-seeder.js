var Product = require('../models/product');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/shopping');
var products = [
    new Product({
    imagePath: 'https://apolloniainaugust.files.wordpress.com/2015/09/the-godfather-book2.jpg',
    title: 'The god father',
    description: 'Best Seller',
    price: 10
}),
    new Product({
    imagePath: 'https://apolloniainaugust.files.wordpress.com/2015/09/the-godfather-book2.jpg',
    title: 'The god father',
    description: 'Best Seller',
    price: 10
}),
new Product({
    imagePath: 'https://apolloniainaugust.files.wordpress.com/2015/09/the-godfather-book2.jpg',
    title: 'The god father',
    description: 'Best Seller',
    price: 10
})
];

var done = 0;
for(var i = 0; i < products.length; i++){
    product[i].save(function(err, result){
        done++;
        if(done == products.length){
            exit();
        }
    });
}

function exit(){
    mongoose.disconnect();
}