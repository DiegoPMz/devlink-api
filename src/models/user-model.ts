import mongoose, { InferSchemaType } from "mongoose";

// interface UserCredentialType {
//   type : string
// }

// interface UserLinkTypes {
//   platform: string, url: string
// }

// interface UserType {
//   email : string,
//   password : string,
//   credentials : UserCredentialType,
//   profile_email : string,
// profile_name : string,
// profile_last_name : string,
// profile_image : string,
// profile_links : UserLinkTypes[] | [],
// profile_template : string,
// }

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
    profile_email: String,
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
export type UserSchemaType = InferSchemaType<typeof userSchema>;
