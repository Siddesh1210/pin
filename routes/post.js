const mongoose=require('mongoose');

const postSchema= mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"UserModel"
    },
    title:String,
    description:String,
    image:String,
})

module.exports=mongoose.model('PostModel',postSchema);