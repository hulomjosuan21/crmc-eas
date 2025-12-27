import axiosClient from "@/lib/axiosClient";
import { ApiResponse } from "@/lib/response";
import { CreateProgram, Program } from "@/types/program_types";

class ProgramService {
  readonly baseUrl: string = "/program";
  async getMany(departmentId: string): Promise<Program[]> {
    const response = await axiosClient.get<Program[]>(
      `/program/list/${departmentId}`
    );
    return response.data;
  }
  async createOne(newProgram: CreateProgram) {
    const response = await axiosClient.post<ApiResponse>(
      `${this.baseUrl}/create`,
      newProgram
    );
    return response.data;
  }
}

export const programService = new ProgramService();
