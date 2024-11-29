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
      unique: true,
      required: true,
      match: [
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
        "Invalid UUID format. A valid UUID must follow the pattern 8-4-4-4-12 hexadecimal characters (e.g., 550e8400-e29b-41d4-a716-446655440000).",
      ], //UUID v4
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("User", userSchema);
export type UserSchemaType = InferSchemaType<typeof userSchema>;
