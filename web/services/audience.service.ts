import axiosClient from "@/lib/axiosClient";
import { ApiResponse } from "@/lib/response";
import { Audience, CreateAudience } from "@/types/audienceTypes";

class AudienceService {
  readonly baseUrl: string = "/audience";

  async createOne(newAudience: CreateAudience) {
    const response = await axiosClient.post<ApiResponse>(
      `${this.baseUrl}/create`,
      newAudience
    );
    return response.data;
  }

  async deleteOne(audienceId: string) {
    const response = await axiosClient.delete<ApiResponse>(
      `${this.baseUrl}/delete/${audienceId}`
    );
    return response.data;
  }

  async getMany(departmentId: string) {
    const response = await axiosClient.get<Audience[]>(
      `${this.baseUrl}/list/${departmentId}`
    );
    return response.data;
  }
}

export const audienceService = new AudienceService();
