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
  contactPerson: { type: String, required: true },
  orderid: { type: String, required: true, unique: true },
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
  status: {
    type: String,
    enum: ["pending", "in_progress", "completed", "rejected"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});


requestSchema.pre("validate", async function (next) {
  if (!this.orderid) {
    this.orderid = `ORD-${Date.now()}`;
  }

  if (this.pagenames && Array.isArray(this.pagenames)) {
    this.pagenames = [...new Set(this.pagenames)];
  }

  next();
})


const Request =
  mongoose.models.Request || mongoose.model("Request", requestSchema);

export default Request;
