const mongoose = require('mongoose');

const obraSchema = new mongoose.Schema({
    titlept: String,
    titleen: String,
    filename: String,
    category: String,
    descriptionpt: String,
    descriptionen: String,
    date: Date,
    public: Boolean
});

obraSchema.virtual('style').get(function () {
    return 'background-image: url(/data/' + this.category + '/' + this.filename + ');';
});


const obra = mongoose.model('obra', obraSchema);

module.exports = obra;