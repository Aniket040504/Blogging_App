const path=require("path");
const express=require('express');
const mongoose=require('mongoose');
const cookieParser=require('cookie-parser');

const userRoute=require("./routes/user");
const { checkForAuthenticationCookie } = require("./middleware/authentication");

const app= express();
const PORT= 5000;

mongoose
    .connect("mongodb://127.0.0.1:27017/bloggify")
    .then((e) => console.log("connected"));

app.set('view engine',"ejs");
app.set('views', path.resolve("./views"));

app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));

app.get("/", (req,res)=>{
    res.render('home',{
        user:req.user,
    });
})

app.use('/user', userRoute);


app.listen(PORT, ()=>console.log(`Server started on ${PORT}`));