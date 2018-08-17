import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/sales";

export function saveSale(sale) {
  return http.post(apiEndpoint, sale);
}
