import mongoose from "mongoose";

const project = new mongoose.Schema({
    personid : { type: mongoose.Schema.Types.ObjectId, ref: 'tblpersonmaster' },
    title : { type: String, required: true },
    description : { type: String, required: true },
    skills_required : { type: [String], required: true },
    budget : { type: Number, required: true },
    duration : { type: String, required: true },
    status : { type: String, default: 'open' },
    ispending : { type: Number, default: 0 },
    freelancerid : { type: mongoose.Schema.Types.ObjectId, ref: 'tblpersonmaster', default: null },
    createdAt: { type: String, default: () => new Date().toISOString() },
})