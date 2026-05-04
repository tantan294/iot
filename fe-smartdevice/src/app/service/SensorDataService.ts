import axios from "axios";
import { ApiUrlUtil } from "../util/ApiUrlUtil";
import { ParamUtil } from "../util/ParamUtil";

export class SensorDataService {
    private static _sensorDataService: SensorDataService;
  
    public static getInstance(): SensorDataService {
      if (!SensorDataService._sensorDataService) {
        SensorDataService._sensorDataService = new SensorDataService();
      }
      return SensorDataService._sensorDataService;
    }

    public getSensorData(modelSearch: any) {
      const params = ParamUtil.toRequestParams(modelSearch);
      const url = ApiUrlUtil.buildQueryString(process.env.REACT_APP_API_URL + "/sensor-data", params);
      return axios.get(url);
    }
}