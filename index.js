const path=require("path");
const express=require('express');
const mongoose=require('mongoose');
const cookieParser=require('cookie-parser');
const dotenv=require('dotenv');

dotenv.config();

const Blog= require('./model/blog');

const userRoute=require("./routes/user");
const blogRoute=require("./routes/blog");

const { checkForAuthenticationCookie } = require("./middleware/authentication");

const app= express();
const PORT= process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI)
    .then((e) => console.log("connected"));

app.set('view engine',"ejs");
app.set('views', path.resolve("./views"));

app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

app.get("/", async (req,res)=>{
    const allBlog=await Blog.find({})
    res.render('home',{
        user:req.user,
        blogs: allBlog,
    });
})

app.use('/user', userRoute);
app.use('/blog', blogRoute);


app.listen(PORT, ()=>console.log(`Server started on ${PORT}`));