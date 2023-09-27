import axios, { AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { Endpoints } from "./Endpoints";

interface RequestOptions {
  method: "POST" | "GET" | "PUT";
  data: any;
  route: string;
}
const baseURL = "https://kabo.designparklab.com.ng";
const PerformRequest = async ({ method, data, route }: RequestOptions) => {
  const config = {
    method,
    data,
    url: `${baseURL}${route}`,
  };
  const r: any = axios.request(config);
  return r;
};

const UploadFile = async (file: File) => {
  const token = Cookies.get("token");

  const fileFormData = new FormData();
  fileFormData.append("token", token ?? "");
  fileFormData.append(
    "file",
    file,
    file.name.toLowerCase().split(" ").join().replaceAll(",", "")
  );
  const config: AxiosRequestConfig = {
    method: "POST",
    url: `${baseURL}${Endpoints.UploadFile}`,

    data: fileFormData,
    maxBodyLength: Infinity,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  const response = await axios.request(config);

  return response as any;
};

export { PerformRequest, UploadFile };
