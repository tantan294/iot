import React from "react";
import { FaSearch, FaSort, FaFilter } from "react-icons/fa";

interface SearchBoxProps {
  searchModel:         { keyword: string; type?: string };
  onChangeSearchInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClickBtnSearch:    () => void;
  onChangeType?:       (e: React.ChangeEvent<HTMLSelectElement>) => void;
  hideSelect?:         boolean;
}

export const SearchBox = ({
  searchModel,
  onChangeSearchInput,
  onClickBtnSearch,
  onChangeType,
  hideSelect = false,
}: SearchBoxProps) => {
  return (
    <div className="search-bar">
      <div className="search-input-wrap">
        <input
          type="text"
          placeholder="Search"
          value={searchModel.keyword}
          onChange={onChangeSearchInput}
          onKeyDown={(e) => e.key === "Enter" && onClickBtnSearch()}
        />
      </div>

      {!hideSelect && onChangeType && (
        <select
          value={searchModel.type ?? "all"}
          onChange={onChangeType}
          style={{
            border: "1px solid #E5E7EB",
            borderRadius: 24,
            padding: "8px 14px",
            background: "#F3F4F6",
            fontSize: 14,
            fontFamily: "Inter, sans-serif",
            outline: "none",
            color: "#374151",
          }}
        >
          <option value="all">All</option>
          <option value="id">ID</option>
          <option value="humidity">Humidity</option>
          <option value="temperature">Temperature</option>
          <option value="light">Light</option>
          <option value="time">Time</option>
        </select>
      )}

      <button className="search-icon-btn" onClick={onClickBtnSearch} title="Search">
        <FaSearch />
      </button>
      <button className="search-icon-btn" title="Sort">
        <FaSort />
      </button>
      <button className="search-icon-btn" title="Filter">
        <FaFilter />
      </button>
    </div>
  );
};
