"use server";

import axiosClient from "@/lib/axiosClient";

export async function createDepartment(formDara: FormData) {
  const response = await axiosClient.post<{
    message: string;
    authorization_url: string;
  }>("/department/signup", formDara);
  const { message, authorization_url } = response.data;

  return { message, authorizationUrl: authorization_url };
}
