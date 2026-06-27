const Task = require("../models/Task");

// Test Gemini API
const testGemini = async (req, res) => {
  try {
    const prompt =
      "Say hello and explain in one line what an AI productivity assistant does.";

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    console.log("Gemini full response:");
    console.log(JSON.stringify(data, null, 2));

    const answer =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from Gemini";

    res.status(200).json({
      message: "Gemini test successful",
      answer,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gemini test failed",
      error: error.message,
    });
  }
};

// Generate AI plan from user's tasks
const generatePlan = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({
      deadline: 1,
    });

    if (tasks.length === 0) {
      return res.status(400).json({
        message: "No tasks found. Please add tasks first.",
      });
    }

    const taskText = tasks
      .map((task, index) => {
        return `
Task ${index + 1}
Title: ${task.title}
Description: ${task.description || "No description"}
Deadline: ${task.deadline}
Priority: ${task.priority}
Estimated Time: ${task.estimatedTime} hours
Status: ${task.status}
`;
      })
      .join("\n");

    const prompt = `
You are an AI productivity assistant.

The user has these tasks:

${taskText}

Create a smart productivity plan.

Give the answer in this format:
1. Most urgent task
2. Best order to complete all tasks
3. Suggested schedule for today
4. Risk warning for tasks that may be missed
5. Productivity tips
6. Short motivational message

Keep the answer simple and practical.
`;

    console.log("Prompt sent to Gemini:");
    console.log(prompt);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    console.log("Gemini full response:");
    console.log(JSON.stringify(data, null, 2));

    const plan =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "AI could not generate a plan. Please try again.";

    res.status(200).json({
      message: "AI plan generated successfully",
      plan,
    });
  } catch (error) {
    res.status(500).json({
      message: "AI plan generation failed",
      error: error.message,
    });
  }
};

module.exports = { testGemini, generatePlan };