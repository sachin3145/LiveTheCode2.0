const crypto = require('crypto'); 
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,'Please tell us your name']
    },
    email:{
        type: String,
        required: [true,'Please tell us your email'],
        unique: [true,'email should be unique'],
        lowerCase: [true,'all letterd in the email should be lower'],
        validate: [validator.isEmail,'please provide a valid email']
    },
    
    role:{
        type:String,
        enum:['user','organiser'],
        default:'user'
    },

    password:{
        type: String,
        required: [true,'please provode a password'],
        minLength: 8,
        select: false // by doing this it will automatically not shown up in any output
    },

    passwordConfirm:{
        type: String,
        required:[true,'please confirm your password'],
        validate:{
            // this will only work on CREATE and SAVE
            validator: function(el){
                return el === this.password;
            },
            message:"password should be same!"
        }
    }
})

const User = mongoose.model('User',userSchema);

module.exports = User;