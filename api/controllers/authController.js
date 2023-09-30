const jwt = require('jsonwebtoken');
const crypto = require('crypto')
const { promisify } = require('util');
const User = require('../models/userModel');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError')

const signToken = id =>{
    return jwt.sign({ id }, process.env.JWT_SECRET);
}

const createSendToken = (user, statusCode, res)=>{
    const token = signToken(user._id);


    user.password = undefined;  // simply removes password field from output

    res.status(statusCode ).json({
        status: 'success',
        token,
        data:{
                user
        }
    });
}


exports.signup = catchAsync(async(req,res,next)=>{
    const newUser = new User({
        name: req.body.name,
        email:req.body.email,
        password:req.body.password,
        passwordConfirm:req.body.passwordConfirm,
        role:req.body.role,
    });
  const resp = await newUser.save().catch(err => { console.log(err.message); throw new Error(err.message)});
  if (resp){
        createSendToken(newUser, 201, res);
  }
       
});


exports.login =catchAsync(async (req,res,next) => {
    const { email, password } = req.body     // simply means const email = req.body.email, const password = req.body.pasword


    //1) Check if the email, password exist
    if(!email || !password){
       return next(new AppError('please provide emailand password',400));
    }

    //Check if user exists and password is correct
    const user = await User.findOne({ email }).select('+password')        //this ({ email }) simply means ({email:email})
    //we need to explicitly select the password field as the output doesnt contain password and we need that to check

    // const correct = await user.correctPassword(password, user.password) // ye yhi p await ho jayega toh if vale m srf first user vali statement run hogi therefore to prevent this and made if to check botht he statements we will await this there
    if(!user || !(await user.correctPassword(password, user.password))){
        return next(new AppError('Incorrect email or password',401))  // 401 means unauthorized
    }
 
    //if everything ok, send token to the client
   createSendToken(user, 200, res);

});

exports.protect = catchAsync(async (req, res, next)=>{

    // 1) getting Token and check if its there ot not
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }
    // console.log(token);

    if(!token){    
        return next(new AppError('You are not logged In!'))
    }

    // 2) Verification of token
    const decoded= await promisify(jwt.verify)(token, process.env.JWT_SECRET)  //it is by default not a promise function but from the starting we are working with promises therefore we will make this fun as a promise by using a node module so that we can use async await functionality here as well
    

    // 3) check if user still exists
    const currentUser = await User.findById(decoded.id);
    if(!currentUser)
    return next(new AppError('The user belonging to this token does no longer exist',401))

    // 4) check if user changed password after the token was issued
   if (currentUser.changedPasswordAfter(decoded.iat)){         // iat meand issued at
        return next(new AppError('user recently changed the password',401));
   }  





   // Grant acces to protected routes
   req.user = currentUser;
    next();
});

exports.restrictTo = (...roles) => {
    //roles here is an array containing values passesd in by the time restrictTo is called i.e['admin','lead-guide']

    return(req, res,next) =>{
        if(!roles.includes(req.user.role)){
            return next( new AppError('you do not have permissioin to perform this action',403 ));
        }
        next();
    }
}