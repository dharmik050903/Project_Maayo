import projectinfo from "../schema/projectinfo.js";
import PersonMaster from "../schema/PersonMaster.js";

export default class Project {
    async listproject(req, res) {
        try {
            const { id, personid, isactive, ispending, iscompleted, status, page, limit } = req.body || {};

            // If specific id provided, return single project
            if (id) {
                const project = await projectinfo
                    .findById(id)
                    .populate('personid')
                    .populate('freelancerid.freelancerid')
                    .populate('skills_required.skill_id');

                if (!project) {
                    return res.status(404).json({ status: false, message: "Project not found" });
                }
                return res.status(200).json({ status: true, message: "Project fetched successfully", data: project });
            }

            // Build filter for list
            const filter = {};
            const userRole = req.headers.user_role;
            // If requester is a freelancer, force pending-only listings (not active and not completed)
            if (userRole === 'freelancer') {
                filter.ispending = 1;
                filter.isactive = 0;
                filter.iscompleted = 0;
            }
            if (personid) filter.personid = personid;
            if (status) filter.status = status;
            if (isactive !== undefined && isactive !== null) filter.isactive = Number(isactive);
            if (ispending !== undefined && ispending !== null) filter.ispending = Number(ispending);
            if (iscompleted !== undefined && iscompleted !== null) filter.iscompleted = Number(iscompleted);

            const pageNum = Math.max(parseInt(page || 1, 10), 1);
            const limitNum = Math.max(parseInt(limit || 20, 10), 1);
            const skipNum = (pageNum - 1) * limitNum;

            const [items, total] = await Promise.all([
                projectinfo
                    .find(filter)
                    .skip(skipNum)
                    .limit(limitNum)
                    .sort({ createdAt: -1 })
                    .populate('personid')
                    .populate('freelancerid.freelancerid')
                    .populate('skills_required.skill_id'),
                projectinfo.countDocuments(filter)
            ]);

            return res.status(200).json({
                status: true,
                message: "Projects fetched successfully",
                data: items,
                pagination: { total, page: pageNum, limit: limitNum }
            });
        } catch (error) {
            res.status(500).json({ status: false, message: "An error occurred while fetching the project", error: error.message });
            console.error("Error fetching project:", error);
        }

    }
    async createProject(req, res) {
        try {
                // Only clients can create projects
                if(req.headers.user_role !== 'client'){
                    return res.status(403).json({message: "Access denied. Only clients can create projects."});
                }

                // Validate requester
                const user = await PersonMaster.findOne({_id: req.headers.id});
                if(!user || user.email != req.headers.user_email){
                    return res.status(400).json({message: "Invalid user."});
                }

                const { title, description, skills_required, budget, duration } = req.body;

                if(!title || !description || !Array.isArray(skills_required) || skills_required.length === 0 || budget === undefined){
                    return res.status(400).json({message: "Missing required fields: title, description, skills_required[], budget"});
                }

                // Normalize skills_required: accept either [{skill, skill_id}] or array of ids with names
                const normalizedSkills = skills_required.map((s) => ({
                    skill: s.skill,
                    skill_id: s.skill_id
                })).filter((s)=> s.skill && s.skill_id);

                if(normalizedSkills.length === 0){
                    return res.status(400).json({message: "skills_required must contain objects with skill and skill_id"});
                }

                const newProject = new projectinfo({
                    personid: user._id,
                    title,
                    description,
                    skills_required: normalizedSkills,
                    budget,
                    duration: duration || 0,
                    status: 'open',
                    ispending: 0,
                    isactive: 1,
                    iscompleted: 0,
                    createdAt: new Date().toISOString()
                });

                await newProject.save();
                return res.status(201).json({message: "Project created successfully", data: newProject});
        } catch (error) {
                console.error("Error creating project:", error);
                return res.status(500).json({message: "Failed to create project", error: error.message});
        }
    }
    async updateProject(req, res) {
        try {
                if(req.headers.user_role !== 'client'){
                    return res.status(403).json({message: "Access denied. Only clients can update projects."});
                }

                const user = await PersonMaster.findOne({_id: req.headers.id});
                if(!user || user.email != req.headers.user_email){
                    return res.status(400).json({message: "Invalid user."});
                }

                const { id, title, description, skills_required, budget, duration, status, ispending, isactive, iscompleted } = req.body || {};
                if(!id){
                    return res.status(400).json({message: "Project id is required"});
                }

                const updateData = {};
                if(title !== undefined) updateData.title = title;
                if(description !== undefined) updateData.description = description;
                if(budget !== undefined) updateData.budget = budget;
                if(duration !== undefined) updateData.duration = duration;
                if(status !== undefined) updateData.status = status;
                if(ispending !== undefined) updateData.ispending = Number(ispending);
                if(isactive !== undefined) updateData.isactive = Number(isactive);
                if(iscompleted !== undefined) updateData.iscompleted = Number(iscompleted);

                if(Array.isArray(skills_required)){
                    const normalizedSkills = skills_required.map((s) => ({
                        skill: s.skill,
                        skill_id: s.skill_id
                    })).filter((s)=> s.skill && s.skill_id);
                    if(normalizedSkills.length === 0){
                        return res.status(400).json({message: "skills_required must contain objects with skill and skill_id"});
                    }
                    updateData.skills_required = normalizedSkills;
                }

                const updated = await projectinfo.findOneAndUpdate(
                    { _id: id, personid: user._id },
                    updateData,
                    { new: true }
                )
                .populate('personid')
                .populate('freelancerid.freelancerid')
                .populate('skills_required.skill_id');

                if(!updated){
                    return res.status(404).json({message: "Project not found or you do not own this project"});
                }

                return res.status(200).json({message: "Project updated successfully", data: updated});
        } catch (error) {
                console.error("Error updating project:", error);
                return res.status(500).json({message: "Failed to update project", error: error.message});
        }

    }
    async deleteProject(req, res) {
        try {
                if(req.headers.user_role !== 'client'){
                    return res.status(403).json({message: "Access denied. Only clients can delete projects."});
                }

                const user = await PersonMaster.findOne({_id: req.headers.id});
                if(!user || user.email != req.headers.user_email){
                    return res.status(400).json({message: "Invalid user."});
                }

                const { id } = req.body || {};
                if(!id){
                    return res.status(400).json({message: "Project id is required"});
                }

                // Fetch project for checks
                const project = await projectinfo.findOne({ _id: id, personid: user._id });
                if(!project){
                    return res.status(404).json({message: "Project not found or you do not own this project"});
                }

                // Deletion rules: only if not active and not completed and no freelancers assigned
                if(Number(project.isactive) === 1){
                    return res.status(400).json({message: "Cannot delete an active project. Deactivate it first."});
                }
                if(Number(project.iscompleted) === 1){
                    return res.status(400).json({message: "Cannot delete a completed project."});
                }
                if(Array.isArray(project.freelancerid) && project.freelancerid.length > 0){
                    return res.status(400).json({message: "Cannot delete a project with assigned freelancers."});
                }

                await projectinfo.deleteOne({ _id: id });

                return res.status(200).json({message: "Project deleted successfully"});
        } catch (error) {
                console.error("Error deleting project:", error);
                return res.status(500).json({message: "Failed to delete project", error: error.message});
        }
    }
}