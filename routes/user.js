const {Router}= require("express");
const User=require("../model/user")

const router=Router();

router.get('/signin',(req,res)=>{
    return res.render("signin");
})


router.get('/signup',(req,res)=>{
    return res.render("signup");
})


router.get('/logout', (req, res, next) => {
  console.log("Logout route hit");
  try {
    res.clearCookie("token");
    res.redirect("/");
  } catch (error) {
    next(error);  // pass error to express error handler if any
  }
});


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


router.post('/signup',async(req,res)=>{
    const {fullName,email,password}=req.body;
    await User.create({
        fullName,
        email,
        password,
    });
    return res.redirect('/');
})

module.exports=router
