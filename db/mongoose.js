var mongoose = require('mongoose');

const uri = "mongodb+srv://jota:sOEgCXTzn7q6J9Xz@joaoribeiro0.priwx.mongodb.net/joaoribeiroart?retryWrites=true&w=majority";

mongoose.connect(uri,{
    useNewUrlParser: true
}).then(() =>{
  console.log('connected to database');
}).catch((error) =>{
  console.error(error);
});