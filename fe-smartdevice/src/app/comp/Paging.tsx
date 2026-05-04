import React from "react";

interface PagingProps {
  pageNumber:      number;
  totalPage:       number;
  pageSize:        number;
  onClickNextPage: () => void;
  onClickPrePage:  () => void;
  onChangePageSize:(e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const Paging = ({
  pageNumber,
  totalPage,
  pageSize,
  onClickNextPage,
  onClickPrePage,
  onChangePageSize,
}: PagingProps) => {
  return (
    <div className="pagination-bar">
      <select
        value={pageSize}
        onChange={onChangePageSize}
        style={{
          border: "1px solid #E5E7EB",
          borderRadius: 8,
          padding: "4px 10px",
          fontSize: 13,
          fontFamily: "Inter, sans-serif",
          color: "#374151",
          background: "#F9FAFB",
          outline: "none",
          marginRight: 8,
        }}
      >
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={15}>15</option>
        <option value={20}>20</option>
      </select>

      <span className="page-info">
        Page: {pageNumber} of {totalPage}
      </span>

      <button
        className="pag-btn"
        onClick={onClickPrePage}
        disabled={pageNumber <= 1}
        title="Previous page"
      >
        ‹
      </button>
      <button
        className="pag-btn"
        onClick={onClickNextPage}
        disabled={pageNumber >= totalPage}
        title="Next page"
      >
        ›
      </button>
    </div>
  );
};
