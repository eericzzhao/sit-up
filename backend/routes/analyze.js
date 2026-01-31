const express = require("express");
const multer = require("multer");
const eyePopService = require("../services/eyepop");
const { analyzePosture } = require("../services/normalize");

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"), false);
    }
    cb(null, true);
  },
});

/**
 * POST /api/analyze
 * Analyze posture from uploaded image or base64 data
 */
router.post("/analyze", upload.single("image"), async (req, res) => {
  try {
    let imageBuffer;

    // Handle file upload
    if (req.file) {
      imageBuffer = req.file.buffer;
    }
    // Handle base64 data from frontend
    else if (req.body.image) {
      const base64Data = req.body.image.replace(/^data:image\/\w+;base64,/, "");
      imageBuffer = Buffer.from(base64Data, "base64");
    } else {
      return res.status(400).json({
        error:
          "No image provided. Send as multipart/form-data or base64 in JSON body.",
      });
    }

    // Analyze pose with EyePop.ai
    const poses = await eyePopService.analyzePose(imageBuffer);

    if (!poses || poses.length === 0) {
      return res.json({
        success: false,
        error:
          "No person detected in the image. Please ensure you are visible in the frame.",
      });
    }

    // Use the first detected person (highest confidence)
    const primaryPose = poses.sort((a, b) => b.confidence - a.confidence)[0];

    // Analyze posture and calculate score
    const analysis = analyzePosture(primaryPose);

    res.json(analysis);
  } catch (error) {
    console.error("Analysis error:", error);

    if (error.message.includes("EYEPOP")) {
      return res.status(503).json({
        error:
          "Pose detection service unavailable. Please check configuration.",
      });
    }

    res.status(500).json({
      error: "Failed to analyze posture",
      message: error.message,
    });
  }
});

/**
 * POST /api/analyze/batch
 * Analyze multiple images for tracking progress
 */
router.post("/analyze/batch", upload.array("images", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        error: "No images provided",
      });
    }

    const results = [];

    for (const file of req.files) {
      try {
        const poses = await eyePopService.analyzePose(file.buffer);

        if (poses && poses.length > 0) {
          const primaryPose = poses.sort(
            (a, b) => b.confidence - a.confidence,
          )[0];
          const analysis = analyzePosture(primaryPose);
          results.push({
            filename: file.originalname,
            ...analysis,
          });
        } else {
          results.push({
            filename: file.originalname,
            success: false,
            error: "No person detected",
          });
        }
      } catch (error) {
        results.push({
          filename: file.originalname,
          success: false,
          error: error.message,
        });
      }
    }

    res.json({
      success: true,
      count: results.length,
      results,
    });
  } catch (error) {
    console.error("Batch analysis error:", error);
    res.status(500).json({
      error: "Failed to analyze images",
      message: error.message,
    });
  }
});

/**
 * GET /api/status
 * Check if EyePop.ai service is connected
 */
router.get("/status", async (req, res) => {
  try {
    const isInitialized = eyePopService.isInitialized;

    res.json({
      status: "ok",
      eyepopConnected: isInitialized,
      version: "1.0.0",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      eyepopConnected: false,
      error: error.message,
    });
  }
});

module.exports = router;
