import { api } from "@/api/_api";
import { UserModel } from "shared-types";

export const loadUserData = async (): Promise<UserModel> => {
  const result = await api.get("/user");

  return result;
};
