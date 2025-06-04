import mongoose from "mongoose";

const { Schema } = mongoose;

const requestSchema = new Schema({
  company: { type: String, required: true },
  images: {
    type: [String],
    validate: {
      validator: function (arr) {
        return arr.length <= 20;
      },
      message: "Maximal 20 Bilder erlaubt.",
    },
  },
  address: { type: String, required: true },
  postcode: { type: String, required: true, match: /^[0-9]{5}$/ },
  city: { type: String, required: true },
  email: { type: String, required: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  shortdescription: { type: String, required: true, maxlength: 1000 },
  colorPrimary: { type: String, required: true },
  colorSecondary: { type: String },
  font: { type: String },
  customFont: { type: String },
  styleWebsite: { type: String, required: true },
  startingPages: { type: String },
  pagenames: {
    type: [String],
    validate: {
      validator: function (arr) {
        return arr.length <= 10;
      },
      message: "Maximal 10 Seiten erlaubt.",
    },
  },
  references: { type: String },
  pageTexts: {
    type: Map,
    of: String,
    default: {},
  },
  extras: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Request =
  mongoose.models.Request || mongoose.model("Request", requestSchema);

export default Request;
