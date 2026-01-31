// PosturePal Posture Analysis & Scoring System

// Keypoint indices (standard COCO format)
const KEYPOINTS = {
  NOSE: 0,
  LEFT_EYE: 1,
  RIGHT_EYE: 2,
  LEFT_EAR: 3,
  RIGHT_EAR: 4,
  LEFT_SHOULDER: 5,
  RIGHT_SHOULDER: 6,
  LEFT_ELBOW: 7,
  RIGHT_ELBOW: 8,
  LEFT_WRIST: 9,
  RIGHT_WRIST: 10,
  LEFT_HIP: 11,
  RIGHT_HIP: 12,
};

/**
 * Calculate angle between three points
 */
function calculateAngle(point1, point2, point3) {
  const radians =
    Math.atan2(point3.y - point2.y, point3.x - point2.x) -
    Math.atan2(point1.y - point2.y, point1.x - point2.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);
  if (angle > 180.0) {
    angle = 360 - angle;
  }
  return angle;
}

/**
 * Calculate distance between two points
 */
function calculateDistance(point1, point2) {
  return Math.sqrt(
    Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2),
  );
}

/**
 * Check if keypoint is visible and confident
 */
function isKeypointValid(keypoint, minConfidence = 0.3) {
  return keypoint && keypoint.confidence >= minConfidence;
}

/**
 * Analyze shoulder alignment
 * Returns score 0-100, where 100 is perfectly aligned
 */
function analyzeShoulderAlignment(keypoints) {
  const leftShoulder = keypoints[KEYPOINTS.LEFT_SHOULDER];
  const rightShoulder = keypoints[KEYPOINTS.RIGHT_SHOULDER];

  if (!isKeypointValid(leftShoulder) || !isKeypointValid(rightShoulder)) {
    return { score: null, angle: null, issue: "shoulders_not_detected" };
  }

  // Calculate shoulder tilt angle
  const deltaY = Math.abs(leftShoulder.y - rightShoulder.y);
  const deltaX = Math.abs(leftShoulder.x - rightShoulder.x);
  const tiltAngle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

  // Ideal: shoulders should be level (0-5 degrees)
  // Acceptable: 5-15 degrees
  // Poor: 15+ degrees
  let score = 100;
  let status = "excellent";

  if (tiltAngle > 15) {
    score = Math.max(0, 100 - (tiltAngle - 15) * 3);
    status = "poor";
  } else if (tiltAngle > 5) {
    score = 100 - (tiltAngle - 5) * 2;
    status = "fair";
  }

  return {
    score: Math.round(score),
    angle: Math.round(tiltAngle * 10) / 10,
    status,
    message:
      tiltAngle > 15
        ? "Shoulders significantly tilted"
        : tiltAngle > 5
          ? "Slight shoulder tilt"
          : "Shoulders well aligned",
  };
}

/**
 * Analyze neck angle and forward head posture
 */
function analyzeNeckAngle(keypoints) {
  const nose = keypoints[KEYPOINTS.NOSE];
  const leftShoulder = keypoints[KEYPOINTS.LEFT_SHOULDER];
  const rightShoulder = keypoints[KEYPOINTS.RIGHT_SHOULDER];
  const leftEar = keypoints[KEYPOINTS.LEFT_EAR];
  const rightEar = keypoints[KEYPOINTS.RIGHT_EAR];

  // Need at least nose and shoulders
  if (
    !isKeypointValid(nose) ||
    (!isKeypointValid(leftShoulder) && !isKeypointValid(rightShoulder))
  ) {
    return { score: null, angle: null, issue: "neck_landmarks_not_detected" };
  }

  // Calculate average shoulder position
  let shoulderX = 0,
    shoulderY = 0,
    shoulderCount = 0;
  if (isKeypointValid(leftShoulder)) {
    shoulderX += leftShoulder.x;
    shoulderY += leftShoulder.y;
    shoulderCount++;
  }
  if (isKeypointValid(rightShoulder)) {
    shoulderX += rightShoulder.x;
    shoulderY += rightShoulder.y;
    shoulderCount++;
  }
  shoulderX /= shoulderCount;
  shoulderY /= shoulderCount;

  // Use ear if available, otherwise use nose
  let headX = nose.x,
    headY = nose.y;
  if (isKeypointValid(leftEar) && isKeypointValid(rightEar)) {
    headX = (leftEar.x + rightEar.x) / 2;
    headY = (leftEar.y + rightEar.y) / 2;
  }

  // Calculate forward head distance (how far head is in front of shoulders)
  const horizontalDistance = Math.abs(headX - shoulderX);
  const verticalDistance = shoulderY - headY; // Positive = head above shoulders

  // Calculate neck angle from vertical
  const neckAngle =
    Math.atan2(horizontalDistance, verticalDistance) * (180 / Math.PI);

  // Ideal: 0-10 degrees forward
  // Acceptable: 10-20 degrees
  // Poor: 20+ degrees (forward head posture)
  let score = 100;
  let status = "excellent";

  if (neckAngle > 20) {
    score = Math.max(0, 100 - (neckAngle - 20) * 2.5);
    status = "poor";
  } else if (neckAngle > 10) {
    score = 100 - (neckAngle - 10) * 2;
    status = "fair";
  }

  return {
    score: Math.round(score),
    angle: Math.round(neckAngle * 10) / 10,
    status,
    message:
      neckAngle > 20
        ? "Significant forward head posture"
        : neckAngle > 10
          ? "Mild forward head posture"
          : "Good neck alignment",
  };
}

/**
 * Analyze spine position (using shoulders and hips)
 */
function analyzeSpinePosition(keypoints) {
  const leftShoulder = keypoints[KEYPOINTS.LEFT_SHOULDER];
  const rightShoulder = keypoints[KEYPOINTS.RIGHT_SHOULDER];
  const leftHip = keypoints[KEYPOINTS.LEFT_HIP];
  const rightHip = keypoints[KEYPOINTS.RIGHT_HIP];

  // Need both shoulders and at least one hip
  if (
    !isKeypointValid(leftShoulder) ||
    !isKeypointValid(rightShoulder) ||
    (!isKeypointValid(leftHip) && !isKeypointValid(rightHip))
  ) {
    return { score: null, angle: null, issue: "spine_landmarks_not_detected" };
  }

  // Calculate center points
  const shoulderCenter = {
    x: (leftShoulder.x + rightShoulder.x) / 2,
    y: (leftShoulder.y + rightShoulder.y) / 2,
  };

  let hipX = 0,
    hipY = 0,
    hipCount = 0;
  if (isKeypointValid(leftHip)) {
    hipX += leftHip.x;
    hipY += leftHip.y;
    hipCount++;
  }
  if (isKeypointValid(rightHip)) {
    hipX += rightHip.x;
    hipY += rightHip.y;
    hipCount++;
  }
  const hipCenter = { x: hipX / hipCount, y: hipY / hipCount };

  // Calculate spine angle from vertical
  const deltaX = Math.abs(shoulderCenter.x - hipCenter.x);
  const deltaY = Math.abs(shoulderCenter.y - hipCenter.y);
  const spineAngle = Math.atan2(deltaX, deltaY) * (180 / Math.PI);

  // Ideal: 0-5 degrees from vertical
  // Acceptable: 5-15 degrees
  // Poor: 15+ degrees (slouching/leaning)
  let score = 100;
  let status = "excellent";

  if (spineAngle > 15) {
    score = Math.max(0, 100 - (spineAngle - 15) * 2.5);
    status = "poor";
  } else if (spineAngle > 5) {
    score = 100 - (spineAngle - 5) * 2;
    status = "fair";
  }

  return {
    score: Math.round(score),
    angle: Math.round(spineAngle * 10) / 10,
    status,
    message:
      spineAngle > 15
        ? "Significant slouching or leaning"
        : spineAngle > 5
          ? "Mild slouching or leaning"
          : "Good spine alignment",
  };
}

/**
 * Calculate overall posture score and provide detailed feedback
 */
function analyzePosture(pose) {
  if (!pose || !pose.keypoints || pose.keypoints.length === 0) {
    return {
      success: false,
      error: "No pose detected",
    };
  }

  const keypoints = pose.keypoints;

  // Analyze each component
  const shoulders = analyzeShoulderAlignment(keypoints);
  const neck = analyzeNeckAngle(keypoints);
  const spine = analyzeSpinePosition(keypoints);

  // Check if we have enough data
  const validScores = [shoulders.score, neck.score, spine.score].filter(
    (s) => s !== null,
  );

  if (validScores.length === 0) {
    return {
      success: false,
      error:
        "Could not detect enough body landmarks. Please ensure your upper body is visible.",
    };
  }

  // Calculate weighted overall score
  // Neck is most important (40%), then spine (35%), then shoulders (25%)
  const weights = { shoulders: 0.25, neck: 0.4, spine: 0.35 };
  let totalScore = 0;
  let totalWeight = 0;

  if (shoulders.score !== null) {
    totalScore += shoulders.score * weights.shoulders;
    totalWeight += weights.shoulders;
  }
  if (neck.score !== null) {
    totalScore += neck.score * weights.neck;
    totalWeight += weights.neck;
  }
  if (spine.score !== null) {
    totalScore += spine.score * weights.spine;
    totalWeight += weights.spine;
  }

  const overallScore = Math.round(totalScore / totalWeight);

  // Determine overall status
  let overallStatus = "excellent";
  let overallMessage = "Excellent posture! Keep it up!";

  if (overallScore < 60) {
    overallStatus = "poor";
    overallMessage = "Poor posture detected. Please adjust your position.";
  } else if (overallScore < 80) {
    overallStatus = "fair";
    overallMessage = "Posture could be improved. Minor adjustments needed.";
  } else if (overallScore < 90) {
    overallStatus = "good";
    overallMessage = "Good posture! Almost perfect.";
  }

  // Compile feedback
  const feedback = [];
  if (shoulders.score !== null && shoulders.score < 80) {
    feedback.push(shoulders.message);
  }
  if (neck.score !== null && neck.score < 80) {
    feedback.push(neck.message);
  }
  if (spine.score !== null && spine.score < 80) {
    feedback.push(spine.message);
  }

  return {
    success: true,
    score: overallScore,
    status: overallStatus,
    message: overallMessage,
    feedback: feedback.length > 0 ? feedback : ["Maintain this great posture!"],
    details: {
      shoulders:
        shoulders.score !== null
          ? shoulders
          : { score: null, message: "Not detected" },
      neck:
        neck.score !== null ? neck : { score: null, message: "Not detected" },
      spine:
        spine.score !== null ? spine : { score: null, message: "Not detected" },
    },
    confidence: pose.confidence || 0,
  };
}

module.exports = {
  analyzePosture,
  analyzeShoulderAlignment,
  analyzeNeckAngle,
  analyzeSpinePosition,
};
