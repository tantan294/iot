import React, { useEffect, useState } from "react";
import { SensorData } from "../model/SensorData";
import { SensorDataService } from "../service/SensorDataService";
import { useAppDispatch } from "../store/hooks";
import { showOrHideSpinner } from "../reducer/SpinnerSlice";
import {
  formatDate,
  flattenSensorRecord,
  getSeverityClass,
  FlatSensorRow,
} from "../util/AppUtil";
import { FaSort, FaFilter, FaSearch } from "react-icons/fa";

export const Statistics = () => {
  const dispatch = useAppDispatch();
  const [data, setData] = useState<SensorData[]>([]);
  const [totalPage, setTotalPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 5; // 5 records = 20 rows

  const fetchData = (page: number, kw: string) => {
    dispatch(showOrHideSpinner(true));
    SensorDataService.getInstance()
      .getSensorData({
        keyword: kw,
        sortBy: "id",
        sortOrder: "desc",
        pageSize,
        pageNumber: page,
        type: "all",
      })
      .then((response) => {
        if (response.data.httpCode === 200) {
          setData(response.data.data);
          setTotalPage(response.data.totalPages);
        }
      })
      .catch(() => {})
      .finally(() => dispatch(showOrHideSpinner(false)));
  };

  useEffect(() => {
    fetchData(pageNumber, keyword);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber]);

  const handleSearch = () => {
    setPageNumber(1);
    fetchData(1, keyword);
  };

  // Flatten all records → rows
  const rows: FlatSensorRow[] = data.flatMap(flattenSensorRecord);

  return (
    <div>
      <h1 className="page-title">Data Sensor</h1>

      {/* Search bar */}
      <div className="search-bar">
        <div className="search-input-wrap">
          <input
            type="text"
            placeholder="Search"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <button className="search-icon-btn" onClick={handleSearch} title="Search">
          <FaSearch />
        </button>
        <button className="search-icon-btn" title="Sort">
          <FaSort />
        </button>
        <button className="search-icon-btn" title="Filter">
          <FaFilter />
        </button>
      </div>

      {/* Table */}
      <div className="data-table-container">
        {rows.length === 0 ? (
          <div style={{ padding: "32px", textAlign: "center", color: "#9CA3AF" }}>
            No data available
          </div>
        ) : (
          <>
            <div style={{ overflowY: "auto", maxHeight: "520px" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Device Name</th>
                    <th>Value</th>
                    <th>Timestamp</th>
                    <th>Severity</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.key}>
                      <td style={{ fontWeight: 600 }}>{row.deviceName}</td>
                      <td>{row.value}</td>
                      <td>{formatDate(row.timestamp)}</td>
                      <td>
                        <span className={getSeverityClass(row.severity)}>
                          {row.severity}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="pagination-bar">
              <span className="page-info">
                Page: {pageNumber} of {totalPage}
              </span>
              <button
                className="pag-btn"
                onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                disabled={pageNumber <= 1}
              >
                ‹
              </button>
              <button
                className="pag-btn"
                onClick={() => setPageNumber((p) => Math.min(totalPage, p + 1))}
                disabled={pageNumber >= totalPage}
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
