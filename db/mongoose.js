var mongoose = require('mongoose');

const uri = "mongodb+srv://jotap:vXlnuT67av6qQPYM@jota-web.jefgf.mongodb.net/jota-web?retryWrites=true&w=majority";

mongoose.connect(uri,{
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() =>{
  console.log('connected to database');
}).catch(() =>{
  console.log('failed connected to database');
});