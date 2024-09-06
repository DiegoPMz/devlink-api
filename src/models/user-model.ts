import mongoose, { InferSchemaType } from "mongoose";

const roleSchema = new mongoose.Schema({
  roles: {
    type: String,
    required: true,
  },
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
    Profile_email: String,
    profile_name: String,
    profile_last_name: String,
    profile_image: String,
    profile_links: [{ platform: String, url: String }],
    profile_template: String,
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("User", userSchema);
export type userSchemaType = InferSchemaType<typeof userSchema>;
