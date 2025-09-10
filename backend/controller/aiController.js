import { GoogleGenerativeAI } from "@google/generative-ai";

// It's recommended to move this to a secure configuration or environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default class AIController {
    /**
     * Generates a personalized proposal for a project bid using a generative AI model.
     * It takes project details and a user prompt to create a compelling cover letter.
     */
    async generateProposal(req, res) {
        try {
            const { title, description, budget, milestones, bid_amount, prompt } = req.body;

            if (!title || !description) {
                return res.status(400).json({
                    status: false,
                    message: "Project title and description are required.",
                });
            }

            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const fullPrompt = `
                Generate a professional and persuasive cover letter for a project bid.

                **Project Details:**
                - **Title:** ${title}
                - **Description:** ${description}
                - **Client's Budget:** ${budget || 'Not specified'}
                - **Proposed Bid Amount:** ${bid_amount || 'Not specified'}
                - **Proposed Milestones:** ${milestones ? JSON.stringify(milestones, null, 2) : 'Not specified'}

                **Instructions from Freelancer:**
                ${prompt || 'Focus on my skills and how they match the project requirements. Keep it professional and concise.'}

                **Your Task:**
                Write a cover letter based on the information above. The tone should be confident, professional, and tailored to the project. Highlight how the freelancer's skills are a perfect fit for the project description. Do not invent skills; assume the freelancer has the relevant expertise mentioned in the project description.
            `;

            const result = await model.generateContent(fullPrompt);
            const response = await result.response;
            const text = response.text();

            return res.status(200).json({
                status: true,
                message: "Proposal generated successfully.",
                data: {
                    proposalText: text,
                },
            });

        } catch (error) {
            console.error("Error generating AI proposal:", error);
            // Check for specific API-related errors if the SDK provides them
            if (error.message.includes('API key not valid')) {
                 return res.status(401).json({
                    status: false,
                    message: "AI service authentication failed. Please check the API key.",
                    error: error.message
                });
            }
            return res.status(500).json({
                status: false,
                message: "Failed to generate AI proposal.",
                error: error.message,
            });
        }
    }
}