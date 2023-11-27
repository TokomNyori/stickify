import mongoose, { Schema } from "mongoose";

const NoteSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    color: { type: String },
    status: {
        type: String,
        enum: ['pinned', 'others'],
        default: 'others',
    },
    userId: {
        type: mongoose.ObjectId,
        required: true,
    },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
    coreUpdated: { type: Date, default: Date.now },
    isPrivate: { type: Boolean, default: false, },
    likes: { type: Number, default: 0, min: 0 },
    likedBy: [{ type: mongoose.ObjectId }],
    copies: { type: Number, default: 0, min: 0 },
    copiedBy: [{ type: mongoose.ObjectId }],
    ytVideo: [{
        ytVideoId: { type: String },
        ytVideoTitle: { type: String },
    }],
    isOriginal: { type: Boolean, default: true, },
    originId: {
        type: mongoose.ObjectId,
        default: function () {
            return this._id;
        },
    },
})

export const NoteModel = mongoose.models.notes || mongoose.model('notes', NoteSchema)