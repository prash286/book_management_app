import { createContext, useContext, useEffect, useRef, useState } from "react";
import "./table.css";

const TableContext = createContext();

function Table({
  children,
  data = [],
  isLoading,
  scrollInsideBody = true,
  columns = "1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr",
  loadingContainer = "Loading...",
}) {
  const tbodyRef = useRef();

  function getScrollWidth() {
    return tbodyRef.current?.offsetWidth - tbodyRef.current?.clientWidth;
  }

  return (
    <TableContext.Provider
      value={{
        data,
        isLoading,
        scrollInsideBody,
        columns,
        loadingContainer,
        tbodyRef,
        getScrollWidth,
      }}
    >
      <table
        style={{
          display: "grid",
          gridTemplateRows: "auto 1fr",
          overflowX: "auto",
          height: `100%`,
        }}
        id="table"
        className="border border-[var(--neutral-800)] rounded"
      >
        {children}
      </table>
    </TableContext.Provider>
  );
}

function Header({ children }) {
  const { scrollInsideBody, columns, getScrollWidth, data } =
    useContext(TableContext);
  const [scrollWidth, setScrollWidth] = useState(0);

  useEffect(() => {
    const width = getScrollWidth();
    setScrollWidth(width);
  }, [data, getScrollWidth]);

  return (
    <thead
      style={!scrollInsideBody ? { position: "sticky", top: 0, zIndex: 1 } : {}}
    >
      <tr
        style={{
          display: "grid",
          gridTemplateColumns: columns,
          alignItems: "center",
          paddingRight: scrollInsideBody && `${scrollWidth}px`,
        }}
        className="bg-[var(--neutral-800)] text-[var(--neutral-200)]"
      >
        {children}
      </tr>
    </thead>
  );
}

function Body({ render }) {
  const { data, isLoading, scrollInsideBody, loadingContainer, tbodyRef } =
    useContext(TableContext);
  if (isLoading) {
    return (
      <tbody
        style={{
          height: data?.length <= 10 && !isLoading ? "auto" : `100%`,
          overflowY: scrollInsideBody && "auto",
        }}
        ref={tbodyRef}
      >
        <tr
          style={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <td>{loadingContainer}</td>
        </tr>
      </tbody>
    );
  } else {
    return (
      <tbody
        style={{
          display: "grid",
          height: data?.length < 10 && !isLoading ? "fit-content" : `100%`,
          overflowY: scrollInsideBody && "auto",
        }}
        ref={tbodyRef}
      >
        {data.length ? (
          data.map(render)
        ) : (
          <tr
            style={{
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "var(--neutral-200)",
            }}
          >
            <td>No Data Found</td>
          </tr>
        )}
      </tbody>
    );
  }
}

function Row({ children }) {
  const { columns } = useContext(TableContext);

  return (
    <tr
      style={{
        display: "grid",
        gridTemplateColumns: columns,
        alignItems: "center",
        height: "100%",
      }}
    >
      {children}
    </tr>
  );
}

Table.Header = Header;
Table.Body = Body;
Table.Row = Row;

export default Table;
