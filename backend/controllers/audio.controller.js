import AudioFile from "../models/audio.model";

export const createAudio = async(req, res, next) => {
    try {
        const audio = await AudioFile.create({
            ...req.body, 
            user: req.user._id
        });

        res.status(201).json({success: true, data: audio})
    } catch (e) {
        next(e);
    }
}