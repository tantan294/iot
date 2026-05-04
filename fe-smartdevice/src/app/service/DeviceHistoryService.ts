import axios from "axios";
import { ApiUrlUtil } from "../util/ApiUrlUtil";
import { ParamUtil } from "../util/ParamUtil";
import { DeviceHistory } from "../model/DeviceHistory";

export class DeviceHistoryService {
    private static _deviceHistoryService: DeviceHistoryService;
  
    public static getInstance(): DeviceHistoryService {
      if (!DeviceHistoryService._deviceHistoryService) {
        DeviceHistoryService._deviceHistoryService = new DeviceHistoryService();
      }
      return DeviceHistoryService._deviceHistoryService;
    }

    public getDeviceHistory(modelSearch: any) {
      const params = ParamUtil.toRequestParams(modelSearch);
      const url = ApiUrlUtil.buildQueryString(process.env.REACT_APP_API_URL + "/device-history", params);
      return axios.get(url);
    }

    public getActionDevices() {
      const url = ApiUrlUtil.buildQueryString(process.env.REACT_APP_API_URL + "/device-history/distinct-devices");
      return axios.get(url);
    }

    public createDeviceHistory(deviceHistory: any) {
      const params = ParamUtil.toRequestParams(deviceHistory);
      const url = ApiUrlUtil.buildQueryString(process.env.REACT_APP_API_URL + "/device-history", params);
      return axios.post(url);
    }
}