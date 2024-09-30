const User = require("../models/user.js");

//get signup
module.exports.renderSignupForm = (req, res)=>{
    res.render("./user/signup.ejs");
}

//post signup
module.exports.signup = async(req, res)=>{
    try{
        let {username, email, password} =req.body;
        const newUser= new User({email,username});
        const registeredUser = await User.register(newUser,password);
        console.log("user: ",registeredUser);
        req.login(registeredUser, (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","User registered Successfully");
            res.redirect("/listings");
        });
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

//get login
module.exports.renderLoginForm = (req, res)=>{
    res.render("./user/login.ejs")
}

//post login
module.exports.login = async(req, res)=>{
    req.flash("success","welcome");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
    req.flash("success","You have Logged Out");
    res.redirect("/listings");    
    });
}