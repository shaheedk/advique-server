
import mongoose from "mongoose";

const tokenBlacklistSchema = new mongoose.Schema({
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now  },
});

const TokenBlacklist =
  mongoose.models.TokenBlacklist ||
  mongoose.model("TokenBlacklist", tokenBlacklistSchema);

export default TokenBlacklist;