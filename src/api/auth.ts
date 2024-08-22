import { endpointsTypes } from "shared-types";
import { api } from "@/api/_api";

export const authLogin = async (
  payload: endpointsTypes.AuthLoginBody,
): Promise<endpointsTypes.AuthLoginResponse> => api.post("/auth/login", payload);

export const authRegister = async (
  payload: endpointsTypes.AuthRegisterBody,
): Promise<endpointsTypes.AuthRegisterResponse> => api.post("/auth/register", payload);
