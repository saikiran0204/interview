const _ = require('lodash');
const uuid = require('uuidv4');
const db = require('../db/db');

class InvoiceController {
    constructor(req, res) {
        this.req = req;
        this.total = 0;
        this.res = res;
    }

    validationForInvoceItems() {
        this.req.body.invoiceItems.map(invoiceItem => {
            if((!invoiceItem.quantity && invoiceItem.quantity <= 0) || (!invoiceItem.amount && invoiceItem.amount <= 0) || (!invoiceItem.price && invoiceItem.price <= 0)) {
                throw {message: 'Invalid invoice or data provided', customMessage: true};
            }
            if (invoiceItem.quantity * invoiceItem.price !== invoiceItem.amount) {
                throw {message: "Amount is equal to Quality * Price", customMessage: true}
            }
            this.totalAmount += invoiceItem.amount; 
        });

    }

    validationForBillSundrys() {
        this.req.body.invoiceBillSundrys.map(invoiceBillSundry => {
            if(typeof invoiceBillSundry.amount !== typeof 0) {
                throw {message: 'Invalid amount for billsundry', customMessage: true};
            }
            this.totalAmount += invoiceBillSundry.amount;
        })
    }



    validation() {
        this.validationForInvoceItems();
        this.validationForBillSundrys();
        if(this.totalAmount !== this.req.body.totalAmount) {
            throw {message: "Total Amount is not equal to Sum(InvoiceItems's Amount) + Sum(InvoiceBillSundry's Amount)", customMessage: true};
        }
    }

    async create() {
        try {
            this.validation();
            let query = `INSERT INTO invoice (code, date, invoiceNumber, customerName, billingAddress, shippingAddress, GSTIN, totalAmount) values(${uuid.uuid()}, ${Date.now()}, ${this.req.body.invoiceNumber}, ${this.req.body.customerName}, ${this.req.body.billingAddress}, ${this.req.body.shippingAddress}, ${this.req.body.GSTIN}, ${this.req.body.totalAmount})`;
            await db(query);
            this.res.status(200).send({success: true, message: "Created successfully"});
        }
        catch(e) {
            // added this lines after call for reference
            if(e.customMessage) {
                this.res.status(400).send({success: false, message: e.message});
            }
            this.res.status(500).send({success: true,message: e.message});
        }

    }

    update(id) {
        this.validation();
    }

    delete(id) {
        
    }



}

modules.exports = InvoiceController;