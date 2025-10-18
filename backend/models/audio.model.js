// this is the product model how our products will be structured in the database
import mongoose from 'mongoose';

const audioFileSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxLength: 255
    },
    description: {
        type: String,
        trim: true,
        maxLength: 1024
    },
    fileURL: {
        type: String,
        required: [true, "File URL is required"],
        trim: true
    },
    format: {
        type: String,
        enum: ["mp3", "wav", "ogg", "flac", "aac", "m4a", "webm"],
        required: [true, "Audio format is required"],
        default: "mp3",
        description: "Defines the file type/encoding format of the file"
    },
    size: {
        type: Number,
        required: false
    },
    transcript: {
        type: String,
        required: [true, "Transcript is required for the application"],
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User reference is required"]
    }
}, {timestamps: true});

const AudioFile = mongoose.model('AudioFile', audioSchema);
export default AudioFile;