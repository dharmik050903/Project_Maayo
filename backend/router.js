import express from "express";
import auth from "./middlewares/auth.js";
import { generateToken } from "./middlewares/token.js";
import Signup from "./controller/signup.js";
import Login from "./controller/login.js";
import FreelancerInfo from "./controller/freelancerInfo.js";
import ClientInfo from "./controller/clientinfo.js";
import skills from "./controller/skills.js";


const router = express.Router();
//Login and Signup Controllers
const signupController = new Signup();
const loginController = new Login();
const freelancerinfo = new FreelancerInfo();
const clientinfo = new ClientInfo();
const skillsController = new skills();

// Route to generate token for testing
// router.post("/api/generate-token", (req, res) => {
//   try {
//     const { id, username, role, email } = req.body;
    
//     if (!id || !username || !role || !email) {
//       return res.status(400).json({ 
//         error: "Missing required fields: id, username, role, email" 
//       });
//     }
    
//     const token = generateToken({ id, username, role, email });
//     res.json({ 
//       message: "Token generated successfully",
//       token: token,
//       user: { id, username, role, email }
//     });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to generate token" });
//   }
// });


// New profile API endpoint with auth middleware
router.post("/api/profile", auth, (req, res) => {
  // Your main function logic will go here
  // req.user contains the decoded token data
  console.log('Working fine');
  res.json({ 
    message: "Profile route accessed successfully",
    user: req.user 
  });
});

export default router;

// Auth routes

//Login and Signup Controllers
router.post("/api/signup",signupController.createuser);
router.post("/api/login",loginController.authenticate);
//Skills Controller
router.post("/api/skills",skillsController.listskills);
//Freelancer and Client Info Controllers
router.post("/api/freelancer/info",auth,freelancerinfo.createFreelancerInfo);
router.post("/api/freelancer/info/update",auth,freelancerinfo.updateFreelancerInfo);
router.post("/api/client/info",auth,clientinfo.createClientInfo);
router.post("/api/client/info/update",auth,clientinfo.updateClientInfo);
