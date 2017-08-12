let mongoose = require('mongoose');

//article schema

let shiftSchema = mongoose.Schema({
  title:{
    type: String,
    required: true
  },
  start_time:{
    type: String,
    required: true
  },
  end_time:{
    type: String,
    required: true
  },
  user_id:{
    type: String,
    required: true
  }

});

let Shift = module.exports = mongoose.model('Shift', shiftSchema);
