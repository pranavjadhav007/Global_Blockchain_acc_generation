import mongoose from 'mongoose';

const connectdb= async ()=>{
    const res=await mongoose.connect(
        "mongodb+srv://db:db@authenticat.iaovajk.mongodb.net/?retryWrites=true&w=majority"
    )
    if(res){
        console.log('connected successfully');
    }
}

export default connectdb;
