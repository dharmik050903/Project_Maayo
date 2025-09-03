import mongoose from "mongoose";

const project = new mongoose.Schema({
    personid : { type: mongoose.Schema.Types.ObjectId, ref: 'tblpersonmaster' },
    title : { type: String, required: true },
    description : { type: String, required: true },
    skills_required : [
        {
            skill: { type: String, required: true },
            skill_id :{ type: mongoose.Schema.Types.ObjectId, ref: 'tblskills', required: true }
        }
    ],
    budget : { type: Number, required: true },
    duration : { type: Number, required: true, default :0}, //in days
    status : { type: String, default: 'open' },
    ispending : { type: Number, default: 0 }, // 0 - No, 1 - Yes
    isactive : { type: Number, default: 1 },// 0 - no, 1 - Yes
    iscompleted : { type: Number, default: 0 },// 0 - No, 1 - Yes
    completed_at : { type: String, default: '' },
    freelancerid : [
        {
            freelancerid: { type: mongoose.Schema.Types.ObjectId, ref: 'tblpersonmaster' },
            freelancername : { type: String ,  default : ''},
        }
    ],
    createdAt: { type: String, default: () => new Date().toISOString() },
})

export default mongoose.model("tblproject", project);