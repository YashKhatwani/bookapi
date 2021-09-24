//import mongoose in a var mongoose or any var 
//create a variable PublicationSchema and assin mongoose.Schema
//Inside it create object and write key:value pairs
//Then create a PublicationModel and assign mongoose.Model('collectionName',PublicationSchema);
//module.exports = Publication

const mongoose = require('mongoose');

const PublicationSchema = mongoose.Schema({
    id: Number,
    name: String,
    books: [String],
});
//.model('collectionName')
const PublicationModel = mongoose.model('publications',PublicationSchema);

module.exports = PublicationModel;
