declare module 'axios' {
  export interface AxiosResponse<T = any> {
    data: T;
  }

  export interface AxiosInstance {
    get<T = any>(url: string, config?: any): Promise<AxiosResponse<T>>;
    post<T = any>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>>;
  }

  interface AxiosStatic {
    create(config?: any): AxiosInstance;
  }

  const axios: AxiosStatic;
  export default axios;
}
