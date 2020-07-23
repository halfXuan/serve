const mongoose = require('mongoose')
const Schema = mongoose.Schema
const likeSchema = new Schema({
    userIp: {
        type: String
    },
    articleId: {
        type: String
    }

})
module.exports = mongoose.model('Likes', likeSchema)