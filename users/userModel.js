const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    notes: [{type: ObjectId, ref: 'Note'}]
})

userSchema.pre('save', function(next) {
    bcrypt.hash(this.password, 10, (error, hash) => {
        if(error) {
            return next(error);
        }
        this.password = hash;
        next();
    })
})

userSchema.methods.validatePassword = function(inputPassword) {
    return bcrypt.compare(inputPassword, this.password);
}

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;