import mongoose, { InferSchemaType } from "mongoose";

const roleSchema = new mongoose.Schema({
  roles: {
    type: String,
    required: true,
  },
});

const imageSchema = new mongoose.Schema({
  id: String,
  url: String,
});

const linkSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  { id: true },
);

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    credentials: {
      type: roleSchema,
      require: true,
      _id: false,
    },
    profile_email: String,
    profile_name: String,
    profile_last_name: String,
    profile_image: {
      type: imageSchema,
      _id: false,
    },
    profile_links: [linkSchema],
    profile_template: {
      type: String,
    },
    theme: {
      type: String,
    },
    template_bg: {
      type: String,
    },
  },
  {
    timestamps: true,
    id: true,
  },
);

export default mongoose.model("User", userSchema);
export type UserSchemaType = InferSchemaType<typeof userSchema> | null;
