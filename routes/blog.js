const {Router}= require("express");
const multer=require('multer');

const Blog=require('../model/blog');
const Comment=require('../model/comment');

const router=Router();
const path=require('path');

// MULTER FUNCTION TO STORE IMAGES IN DB

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    const fileName=`${Date.now()}-${file.originalname}`;
    cb(null,fileName);
  }
})

const upload = multer({ storage: storage })

// @desc 
// @routes
// access

router.get('/add-new', (req,res)=>{
  try{
    return res.render('addBlog',{
        user:req.user,
    })
  } catch(err){
    console.log(err);
  }
})

/// ADDING COMMENTS


// @desc
// @routes
// access


router.post("/comment/:blogId", async (req, res) => {
  try{
  await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });
  return res.redirect(`/blog/${req.params.blogId}`);
} catch(err){
  console.log(err);
}
});

// @desc
// @routes
// access

router.post('/', upload.single("coverImage"), async(req,res)=>{
  try{
    const {title,body} =req.body;
    const blog= await Blog.create({
        body,
        title,
        createdBy: req.user._id,
        coverImageURL: `uploads/${req.file.filename}`,
    })
    return res.redirect(`/blog/${blog._id}`)
  }catch(err){
    console.log(err);
  }
})

// @desc
// @routes
// access


router.get('/:id', async(req,res)=>{
  try{
  const blog=await Blog.findById(req.params.id).populate("createdBy");
  const comments=await Comment.find({blogId:req.params.id}).populate("createdBy");
  console.log(comments)
  return res.render('blog',{
    user:req.user,
    blog,
    comments,
  })
} catch(err){
  console.log(err);
}
})

module.exports=router
