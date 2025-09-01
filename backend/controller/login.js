import PersonMaster from "../schema/PersonMaster.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../middlewares/token.js";

export default class Login {
    async authenticate(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: "Email and password are required" });
            }

            const user = await PersonMaster.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            const token = generateToken({
                id: String(user._id),
                username: user.personName || `${user.first_name} ${user.last_name}`,
                role: user.user_type,
                email: user.email
            });

            await PersonMaster.updateOne(
                { _id: user._id },
                { $set: { last_login: new Date().toISOString() } }
            );

            return res.json({
                message: "Login successful",
                token,
                user: {
                    _id: user._id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    personName: user.personName,
                    email: user.email,
                    contact_number: user.contact_number,
                    country: user.country,
                    user_type: user.user_type,
                    status: user.status,
                    createdAt: user.createdAt,
                    last_login: new Date().toISOString()
                }
            });
        } catch (error) {
            console.error("Error during login:", error);
            return res.status(500).json({ message: "Failed to login", error: error.message });
        }
    }
}


