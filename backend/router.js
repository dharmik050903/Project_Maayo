import express from "express";
import auth from "./middlewares/auth.js";
import { generateToken } from "./middlewares/token.js";
const router = express.Router();

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
