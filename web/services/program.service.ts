import axiosClient from "@/lib/axiosClient";
import { ApiResponse } from "@/lib/response";
import {
  CreateProgram,
  Program,
  ProgramSelectOption,
} from "@/types/program_types";

class ProgramService {
  readonly baseUrl: string = "/program";

  async getMany(departmentId: string): Promise<Program[]> {
    const response = await axiosClient.get<Program[]>(
      `/program/list/${departmentId}`
    );
    return response.data;
  }

  async getSelectOptions(departmentId: string): Promise<ProgramSelectOption[]> {
    const response = await axiosClient.get<ProgramSelectOption[]>(
      `/program/select-options/${departmentId}`
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

  async deleteOne(programId: string) {
    const response = await axiosClient.delete<ApiResponse>(
      `${this.baseUrl}/delete/${programId}`
    );
    return response.data;
  }
}

export const programService = new ProgramService();
