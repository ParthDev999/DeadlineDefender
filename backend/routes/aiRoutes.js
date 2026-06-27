const express = require("express");
const { testGemini, generatePlan } = require("../controllers/aiControllers");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/test", testGemini);
router.post("/plan", protect, generatePlan);

module.exports = router;