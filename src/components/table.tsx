import Image from "next/image";
import { CSSProperties, Fragment, Key, ReactElement } from "react";

export interface ColumnType<T> {
  title: ReactElement;
  key: Key;
  dataIndex: keyof T;
  width?: string | number;
  render?: (row: T) => ReactElement;
}

interface Props<T> {
  dataSource: T[];
  columns: ColumnType<T>[];
  styles?: CSSProperties;
  contentClassName?: string;
  onRowClick?: (row: T) => void;
}

export default function Table<T extends { key: Key }>({
  columns,
  dataSource,
  styles,
  contentClassName,
  onRowClick,
}: Props<T>) {
  const templateCols = columns.reduce((acc, cur) => {
    const width = typeof cur.width === "string" ? cur.width : typeof cur.width === "number" ? `${cur.width}px` : "1fr";
    if (acc === "auto") {
      acc = width;
    } else {
      acc = `${acc} ${width}`;
    }
    return acc;
  }, "auto");

  return (
    <div className="overflow-auto">
      <div className="w-full min-w-[872px]" style={styles}>
        {/* table header */}
        <div
          className="grid items-center gap-middle bg-app-black px-middle py-large text-xs font-bold text-white"
          style={{ gridTemplateColumns: templateCols }}
        >
          {columns.map(({ key, title }) => (
            <Fragment key={key}>{title}</Fragment>
          ))}
        </div>
        {/* table body */}
        <>
          {dataSource.length ? (
            <div className={`overflow-auto ${contentClassName}`}>
              {dataSource.map((row) => (
                <div
                  key={row.key}
                  className={`grid items-center gap-middle border-b border-b-white/20 px-middle py-middle text-sm font-light text-white last:border-b-0 ${
                    onRowClick ? "transition-opacity hover:cursor-pointer hover:opacity-80 active:opacity-60" : ""
                  }`}
                  style={{ gridTemplateColumns: templateCols }}
                >
                  {columns.map(({ key, dataIndex, render }) => (
                    <Fragment key={key}>
                      {render ? render(row) : <span className="truncate">{row[dataIndex]}</span>}
                    </Fragment>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-large py-10">
              <Image width={50} height={63} alt="Table no data" src="/images/no-data.svg" />
              <span className="text-sm font-light text-white/50">No data</span>
            </div>
          )}
        </>
      </div>
    </div>
  );
}
