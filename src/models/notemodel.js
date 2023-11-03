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
    likes: { type: Number },
    likedBy: [{ type: mongoose.ObjectId }],
    isPrivate: { type: Boolean, default: false, },
})

export const NoteModel = mongoose.models.notes || mongoose.model('notes', NoteSchema)