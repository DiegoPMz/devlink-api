import mongoose from "mongoose";

export interface TokenSchemaType {
  token: string;
  type: "acc" | "ref";
  user_id: string;
  session_id: string;
}

const tokenSchemaDb = new mongoose.Schema<TokenSchemaType>({
  token: {
    type: String,
    require: true,
  },
  user_id: {
    type: String,
  },
  type: {
    type: String,
  },
  session_id: {
    type: String,
  },
});

export default mongoose.model("Token", tokenSchemaDb);
