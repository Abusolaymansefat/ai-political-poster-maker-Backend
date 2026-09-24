import rateLimit from "express-rate-limit";

export const generationRateLimit =
  rateLimit({
    windowMs: 15 * 60 * 1000,

    max: 5,

    message: {
      success: false,
      message:
        "Too many poster generation requests. Please try again later."
    },

    standardHeaders: true,
    legacyHeaders: false
  });