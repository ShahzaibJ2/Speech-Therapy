import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minLength: 2,
        maxLength: 255
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Please fill a valid email address'], 
    },
    password: {
        type: String,
        required:[true, 'Password is required'],
        minLength: 6
    }

}, {timestamps: true});

const User = mongoose.model('User', userSchema);
export default User;