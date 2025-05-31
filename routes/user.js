const {Router}= require("express");
const User=require("../model/user")

const router=Router();


// @desc 
// @routes
// access

router.get('/signin',(req,res)=>{
    try{
    return res.render("signin");
} catch(err){
    console.log(err);
}
})

// @desc 
// @routes
// access


router.get('/signup',(req,res)=>{
    try{
    return res.render("signup");
} catch(err){
    console.log(err);
}
})


// @desc 
// @routes
// access


router.get('/logout', (req, res, next) => {
  console.log("Logout route hit");
  try {
    res.clearCookie("token");
    res.redirect("/");
  } catch (error) {
    next(error);  // pass error to express error handler if any
  }
});

// @desc 
// @routes
// access

router.post('/signin' , async(req,res)=>{
    try{
    const {email,password}=req.body;
    const token= await User.matchPasswordandGenerateToken(email,password);
    return res.cookie("token",token).redirect('/');
    }
    catch(err){
        console.log(err);
       return res.render('signin',{
            error: "Incorrect Email or Password",
        }
        )
    }

})

// @desc 
// @routes
// access

router.post('/signup',async(req,res)=>{
    try{
    const {fullName,email,password}=req.body;
    await User.create({
        fullName,
        email,
        password,
    });
    return res.redirect('/');
} catch(err){
    console.log(err);
     return res.render('signup',{
            error: "Kindly enter all credentials",
        }
)}
})


module.exports=router
