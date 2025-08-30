import mongoose from "mongoose";

const freelancerInfo = new mongoose.Schema({
    personId: { type: mongoose.Schema.Types.ObjectId, ref: 'tblpersonmaster' },
    name: { type: String },
    title: { type: String, required: true },
    overview: { type: String, required: true },
    skills: { type: String, required: true },   
    hourly_rate: { type: Number, required: true },  
    experience_level: { type: String, required: true },
    availability: { type: String, required: true },
    portfolio: { type: String },
    total_projects: { type: Number, default: 0 }, 
    english_level: { type: String },   
    bio: { type: String },
    employement_history: [{
        _id: false,
        compayname: { type: String },
        role: { type: String },
        years: { type: Number },
        months: { type: Number }
    }],
    highest_education: { type: String },
    certification: [
        {
            _id: false,
            name: { type: String, required: true },
            link: { type: String }
        }
    ],
    createdAt: { type: String, default: () => new Date().toISOString() },   
    updateAt :{type :String , default : null}
})    

export default mongoose.model('tblfreelancerinfo', freelancerInfo);