const mongoose=require('mongoose');
const plm=require('passport-local-mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/pin');

const userSchema= mongoose.Schema({
    username:String,
    email:String,
    password:String,
    fullname:String,
    boards:{
        type:Array,
        default:[]
    },
    posts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"PostModel"
    }],
    profileImage:String,
})

userSchema.plugin(plm)


module.exports=mongoose.model('UserModel',userSchema);