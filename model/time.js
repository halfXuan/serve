const mongoose = require('mongoose')
const Schema = mongoose.Schema
const timeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    timeLineDate: {
        type: Number,
        required: true
    },
    createDate: {
        type: Number,
        required: true,
        default: new Date().getTime() / 1000
    }
})

module.exports = mongoose.model('Times', timeSchema)