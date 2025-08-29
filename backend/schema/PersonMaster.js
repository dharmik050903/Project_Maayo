import mongoose, { Mongoose } from "mongoose";

const personMaster = new mongoose.Schema({
    personId: { type:mongoose.Schema.Types.ObjectId},
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    personName: { type: String },
    profile_pic: { type: String },
    last_login: { type: String },

    password: { type: String, required: true },
    email: { type: String, required: true },

    contact_number: { type: String, required: true }, 
    country: { type: String, },
    user_type: { type: String, required: true }, // Freelance or Client 
    
    // 0 for Inactive and 1 for Active
    status: { type: Number , default:0},
    email_verified: { type: Number, default:0 },  // 0 for Unverified and 1 for Verified
    phone_verified: { type: Number, default:0 },  // 0 for Unverified and 1 for Verified
    createdAt: { type: String, default: () => new Date().toISOString() },
})

export default mongoose.model('tblpersonmaster', personMaster);