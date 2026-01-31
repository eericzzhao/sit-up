const EyePop = require("@eyepop.ai/eyepop");

class EyePopService {
  constructor() {
    this.endpoint = null;
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;

    const popId = process.env.EYEPOP_POP_ID;
    const secretKey = process.env.EYEPOP_SECRET_KEY;

    if (!popId || !secretKey) {
      throw new Error(
        "EYEPOP_POP_ID and EYEPOP_SECRET_KEY must be set in environment variables",
      );
    }

    try {
      this.endpoint = await EyePop.endpoint({
        popId: popId,
        auth: { secretKey: secretKey },
      }).connect();

      this.isInitialized = true;
      console.log("✅ EyePop.ai connected successfully");
    } catch (error) {
      console.error("❌ Failed to connect to EyePop.ai:", error);
      throw error;
    }
  }

  async analyzePose(imageBuffer) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // Upload image and get results
      const results = await this.endpoint.upload(imageBuffer);

      // Extract pose keypoints from results
      const poses = [];

      for await (const result of results) {
        if (result.objects) {
          for (const obj of result.objects) {
            // Look for person detections with keypoints
            if (obj.classLabel === "person" && obj.keyPoints) {
              poses.push({
                keypoints: obj.keyPoints,
                confidence: obj.confidence,
                boundingBox: {
                  x: obj.x,
                  y: obj.y,
                  width: obj.width,
                  height: obj.height,
                },
              });
            }
          }
        }
      }

      return poses;
    } catch (error) {
      console.error("Error analyzing pose:", error);
      throw new Error("Failed to analyze pose with EyePop.ai");
    }
  }

  async disconnect() {
    if (this.endpoint) {
      await this.endpoint.disconnect();
      this.isInitialized = false;
      console.log("EyePop.ai disconnected");
    }
  }
}

// Singleton instance
const eyePopService = new EyePopService();

// Graceful shutdown
process.on("SIGTERM", async () => {
  await eyePopService.disconnect();
});

process.on("SIGINT", async () => {
  await eyePopService.disconnect();
  process.exit(0);
});

module.exports = eyePopService;
