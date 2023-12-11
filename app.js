const express = require('express');
const app = express();
const invoiceController = require('./controllers/invoices');


app.use(express.bodyParser.urlencoded({ extended: true }));

// create
app.put('/create', function (req, res){
    let invoice = new invoiceController(req, res);
    return invoice.create();
});

// update


//delete

//retrieve

//list with pagination