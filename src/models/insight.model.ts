import mongoose from "mongoose";
import { Insights } from "../interfaces/insights.interfaces";

const InsightSchema = new mongoose.Schema<Insights>(
  {
    cardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Card",
      require: true,
    },
    numberOfLeadGenerated: {
      type: Number,
      default: 0,
    },
    numberOfLinkTaps: {
      type: Number,
      default: 0,
    },
    numberOfCardViews: {
      type: Number,
      default: 0,
    },
    numberOfContactsDownload: {
      type: Number,
      default: 0,
    },
    leads: [
      {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "FormData" },
        time: {
          type: Date,
          default: Date.now(),
        },
        locationFromIp: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);
const Insight = mongoose.model<Insights>("Insight", InsightSchema);
export default Insight;
