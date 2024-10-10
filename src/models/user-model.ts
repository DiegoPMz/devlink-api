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
    profile_links: [{ platform: String, url: String }],
    profile_template: String,
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("User", userSchema);
export type UserSchemaType = InferSchemaType<typeof userSchema>;
