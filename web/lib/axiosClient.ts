import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

const DEV = process.env.NEXT_PUBLIC_DEV === "true";

class AxiosClient {
  private readonly instance: AxiosInstance;

  constructor() {
    const baseURL =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

    this.instance = axios.create({
      baseURL,
      timeout: 50000,
      timeoutErrorMessage: "Request timed out",
      withCredentials: true,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (DEV) {
          console.log("[Request]", {
            url: config.url,
            method: config.method,
            data: config.data,
            headers: config.headers,
            withCredentials: config.withCredentials,
          });
        }
        return config;
      }
    );

    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        if (DEV) {
          console.log("[Response]", {
            url: response.config.url,
            status: response.status,
            data: response.data,
          });
        }
        return response;
      },
      (error: unknown) => {
        if (DEV) {
          console.error("[Error]", error);
        }
        return Promise.reject(error);
      }
    );
  }

  public request<T = unknown>(
    config: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.request<T>(config);
  }

  public get<T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.get<T>(url, config);
  }

  public post<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.post<T>(url, data, config);
  }

  public put<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.put<T>(url, data, config);
  }

  public patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.patch<T>(url, data, config);
  }

  public delete<T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.delete<T>(url, config);
  }

  public head<T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.head<T>(url, config);
  }

  public options<T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.options<T>(url, config);
  }

  public postForm<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.postForm<T>(url, data, config);
  }

  public putForm<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.putForm<T>(url, data, config);
  }

  public patchForm<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.patchForm<T>(url, data, config);
  }

  public get raw(): AxiosInstance {
    return this.instance;
  }
}

export default new AxiosClient();
