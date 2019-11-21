const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    keyword: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
        validate: {
            validator: (link) => /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.([-a-zA-Z0-9@:%_+.~#?&//=]*)([-a-zA-Z0-9@:%_+.~#?&//=]*)/g.test(link),
        },
        message: (link) => `${link.value} is not a valid link`,
    },
    link: {
        type: String,
        required: true,
        validate: {
            validator: (link) => /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.([-a-zA-Z0-9@:%_+.~#?&//=]*)([-a-zA-Z0-9@:%_+.~#?&//=]*)/g.test(link),
        },
        message: (link) => `${link.value} is not a valid link`,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
});
module.exports = mongoose.model('article', articleSchema);
