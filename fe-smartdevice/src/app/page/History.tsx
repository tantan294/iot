import React, { useEffect, useState } from "react";
import { DeviceHistory } from "../model/DeviceHistory";
import { DeviceHistoryService } from "../service/DeviceHistoryService";
import { useAppDispatch } from "../store/hooks";
import { showOrHideSpinner } from "../reducer/SpinnerSlice";
import { formatDate, translateDeviceName } from "../util/AppUtil";
import { FaSort, FaSearch } from "react-icons/fa";

type SearchModel = {
  keyword: string;
  sortBy: string;
  sortOrder: string;
  pageSize: number;
  pageNumber: number;
  timer: number;
  deviceName: string;
  actionStatus: string; // "all", "on", "off"
};

const StatusBadge = ({ action }: { action: boolean }) => (
  <span className={`badge-status ${action ? "badge-on" : "badge-off"}`}>
    {action ? "On" : "Off"}
  </span>
);

export const History = () => {
  const dispatch = useAppDispatch();
  const [data, setData] = useState<DeviceHistory[]>([]);
  const [totalPage, setTotalPage] = useState(0);
  const [searchModel, setSearchModel] = useState<SearchModel>({
    keyword: "",
    sortBy: "id",
    sortOrder: "desc",
    pageSize: 10,
    pageNumber: 1,
    timer: 0,
    deviceName: "",
    actionStatus: "all",
  });

  useEffect(() => {
    dispatch(showOrHideSpinner(true));
    DeviceHistoryService.getInstance()
      .getDeviceHistory({
        keyword:    searchModel.keyword,
        sortBy:     searchModel.sortBy,
        sortOrder:  searchModel.sortOrder,
        pageSize:   searchModel.pageSize,
        pageNumber: searchModel.pageNumber,
        deviceName: searchModel.deviceName,
        actionStatus: searchModel.actionStatus === "on" ? true : searchModel.actionStatus === "off" ? false : undefined,
      })
      .then((response) => {
        if (response.data.httpCode === 200) {
          setData(response.data.data);
          setTotalPage(response.data.totalPages);
        }
      })
      .catch(() => {})
      .finally(() => dispatch(showOrHideSpinner(false)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchModel.timer]);

  const handleSort = (sortBy: string) => {
    setSearchModel((prev) => ({
      ...prev,
      sortBy,
      sortOrder: prev.sortOrder === "asc" ? "desc" : "asc",
      timer: Date.now(),
    }));
  };

  return (
    <div>
      <h1 className="page-title">Action History</h1>

      {/* Filter/sort toolbar */}
      <div className="search-bar">
        <div className="search-input-wrap">
          <input
            type="text"
            placeholder="Search action or time..."
            value={searchModel.keyword}
            onChange={(e) => setSearchModel(p => ({ ...p, keyword: e.target.value }))}
            onKeyDown={(e) => e.key === "Enter" && setSearchModel(p => ({ ...p, timer: Date.now(), pageNumber: 1 }))}
          />
        </div>
        
        <select 
          className="search-select"
          value={searchModel.deviceName}
          onChange={(e) => setSearchModel(p => ({ ...p, deviceName: e.target.value, timer: Date.now(), pageNumber: 1 }))}
        >
          <option value="">All Devices</option>
          <option value="fan">Fan</option>
          <option value="bulb">Bulb</option>
          <option value="dehumidifier">Dehumidifier</option>
        </select>

        <select 
          className="search-select"
          value={searchModel.actionStatus}
          onChange={(e) => setSearchModel(p => ({ ...p, actionStatus: e.target.value, timer: Date.now(), pageNumber: 1 }))}
        >
          <option value="all">All Status</option>
          <option value="on">On</option>
          <option value="off">Off</option>
        </select>

        <button className="search-icon-btn" onClick={() => setSearchModel(p => ({ ...p, timer: Date.now(), pageNumber: 1 }))} title="Search">
          <FaSearch />
        </button>
        <button className="search-icon-btn" onClick={() => handleSort("time")} title="Sort Time">
          <FaSort />
        </button>
      </div>

      {/* Table */}
      <div className="data-table-container">
        {data.length === 0 ? (
          <div style={{ padding: "32px", textAlign: "center", color: "#9CA3AF" }}>
            No data available
          </div>
        ) : (
          <>
            <div style={{ overflowY: "auto", maxHeight: "520px" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>List</th>
                    <th>Device Name</th>
                    <th>Status</th>
                    <th>Time on</th>
                    <th>Time off</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, idx) => (
                    <tr key={item.id}>
                      <td>{(searchModel.pageNumber - 1) * searchModel.pageSize + idx + 1}</td>
                      <td style={{ fontWeight: 600 }}>{translateDeviceName(item.name)}</td>
                      <td>
                        <StatusBadge action={item.action} />
                      </td>
                      <td>{item.action ? formatDate(item.time) : "..."}</td>
                      <td>{!item.action ? formatDate(item.time) : "..."}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="pagination-bar">
              <span className="page-info">
                Page: {searchModel.pageNumber} of {totalPage}
              </span>
              <button
                className="pag-btn"
                onClick={() =>
                  setSearchModel((p) => ({
                    ...p,
                    pageNumber: Math.max(1, p.pageNumber - 1),
                    timer: Date.now(),
                  }))
                }
                disabled={searchModel.pageNumber <= 1}
              >
                ‹
              </button>
              <button
                className="pag-btn"
                onClick={() =>
                  setSearchModel((p) => ({
                    ...p,
                    pageNumber: Math.min(totalPage, p.pageNumber + 1),
                    timer: Date.now(),
                  }))
                }
                disabled={searchModel.pageNumber >= totalPage}
              >
                ›
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
