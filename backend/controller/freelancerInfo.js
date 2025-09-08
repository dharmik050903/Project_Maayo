import freelancerInfo from "../schema/freelancerInfo.js";
import PersonMaster from "../schema/PersonMaster.js";


export default class FreelancerInfo {
    async listfreelancer(req,res){
        try {
            if(req.body.id && req.body.user_role === "freelancer"){
                const freelancer = await freelancerInfo.findById(req.body.id)
                if(!freelancer){
                    res.status(404).json({ message: "Freelancer info not found" });
                }
                if(freelancer){
                    res.status(200).json({ message: "Freelancer info retrieved successfully", data: freelancer });
                }
            }
            if(req.body.user_role === "freelancer" && req.body.name){
                const freelancers = await freelancerInfo.find({name: { $regex: req.body.name, $options: 'i' }})
                if(freelancers.length === 0){
                    res.status(404).json({ message: "No freelancers found" });
                }
                if(freelancers.length > 0){
                    res.status(200).json({ message: "Freelancers retrieved successfully", data: freelancers });
                }
            }
        } catch (error) {
            res.status(500).json({ message: "Failed to retrieve freelancer info", error: error.message });
            console.error("Error retrieving freelancer info:", error);
        }
    }
    async createFreelancerInfo(req, res) {
        try {
            if (req.headers.user_role !== 'freelancer') {
                return res.status(403).json({ message: "Access denied. Only freelancers can create freelancer info." });
            }
            const user = await PersonMaster.findOne({email: req.headers.user_email});
            if (!user.email) {
                return res.status(400).json({ message: "Invalid user." });
            }
            const userdeails = user._id
            const name = user.personName
            const { title, overview, skills, hourly_rate, experience_level, availability, portfolio } = req.body;
            if (!title || !overview || !skills || !hourly_rate || !experience_level || !availability) {
                return res.status(400).json({ message: "Missing required fields." });
            }   
            const newFreelancerInfo = new freelancerInfo({
                personId: userdeails,
                name,
                title,
                overview,
                skills :req.body.skills || [],
                hourly_rate,
                experience_level,
                availability,
                portfolio,
                certification: req.body.certification || [],
                employement_history: req.body.employement_history || [],
                highest_education: req.body.highest_education || "",
                createdAt: new Date().toISOString()
            });
            await newFreelancerInfo.save();
            res.status(201).json({ message: "Freelancer info created successfully", data: newFreelancerInfo });

        } catch (error) {
            res.status(500).json({ message: "Failed to create freelancer info", error: error.message });
            console.error("Error creating freelancer info:", error);
        }
    }
    async updateFreelancerInfo(req, res) {
        try {
            const id = req.body._id;
            req.body.updateAt = new Date().toISOString()
            const update = await freelancerInfo.findByIdAndUpdate(id, req.body, { new: true });
            if(update){
                res.status(200).json({ message: "Freelancer info updated successfully", data: update });
            }
            else{
                res.status(404).json({ message: "Freelancer info not found" });
            }
        } catch (error) {
            res.status(500).json({ message: "Failed to update freelancer info", error: error.message });
            console.error("Error updating freelancer info:", error); 
        }
    }
}