var express = require('express');
var router = express.Router();
const UserModel=require('./users');
const PostModel=require("./post")
const passport = require('passport');
const localStrategy=require('passport-local')
const upload=require('./multer');

passport.use(new localStrategy(UserModel.authenticate()))

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index',{nav:false});
});

router.get('/login', function(req, res, next) {
    res.render('login',{nav:false});
  });

  router.get('/add',isLoggedIn, async function(req, res, next) {
    const user=await UserModel.findOne({username:req.session.passport.user});
    res.render("add",{user,nav:true})
  });

  router.get('/profile',isLoggedIn,async function(req, res, next) {
    const user=await UserModel.findOne({username:req.session.passport.user})
    .populate('posts');
    console.log(user);
    res.render("profile",{user,nav:true})
  });

  router.get("/feed",isLoggedIn,async(req,res)=>{
    const user=await UserModel.findOne({username:req.session.passport.user});
    const posts =await PostModel.find().populate('user');

    res.render('feed',{user,posts,nav:true});
  })

  router.get("/post/:postid",isLoggedIn,async(req,res)=>{
    const post=await PostModel.findOne({_id:req.params.postid});
    // console.log(post);
    const userDetail=await PostModel.findOne({user:post.user});
    // console.log(userDetail);
    const user=await UserModel.findOne({_id:userDetail.user});
    console.log(user);
    res.render("postdetail",{user,post,nav:true})
  })

  router.get('/show/posts',isLoggedIn,async function(req, res, next) {
    const user=await UserModel.findOne({username:req.session.passport.user})
    .populate('posts');
    console.log(user);
    res.render("show",{user,nav:true})
  });

  router.post("/fileupload",isLoggedIn,upload.single('image'),async (req,res)=>{
    const user=await UserModel.findOne({username:req.session.passport.user});
    user.profileImage=req.file.filename;
    await user.save();
    res.redirect("/profile")
  })

  router.post("/createpost",isLoggedIn,upload.single('postimage'),async (req,res)=>{
    const user=await UserModel.findOne({username:req.session.passport.user});
    const post=await PostModel.create({
        title:req.body.title,
        description:req.body.description,
        user:user._id,
        image:req.file.filename,
    })
    user.posts.push(post._id);
    await user.save();
    res.redirect("/profile");
  })

router.post("/register",(req,res)=>{
    const data=new UserModel({
        fullname:req.body.fullname,
        username:req.body.username,
        email:req.body.email,
    })
    UserModel.register(data,req.body.password)
    .then(()=>{
        passport.authenticate("local")(req,res,()=>{
            res.redirect("/profile")
        })
    })
})


router.post("/login",passport.authenticate("local",{
    failureRedirect:"/",
    successRedirect:'/profile'
}),(req,res)=>{})


router.get("/logout",(req,res,next)=>{
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/login');
      });
})


function isLoggedIn(req,res,next)
{
    if(req.isAuthenticated())
    {
        return next();
    }
    res.redirect("/");
}
module.exports = router;
