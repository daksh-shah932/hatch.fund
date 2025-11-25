import mongoose from "mongoose";
const {Schema,model}=mongoose;

const UserSchema =new Schema({
    email: {type:String,required:true},
    name: {type:String},
    username: {type:String,required:true},
    profilepic: {type:String},
    coverpic: {type:String},
    razorpayId: {type:String},
    razorpaySecret: {type:String},
})

export default mongoose.models.User || model("User",UserSchema);