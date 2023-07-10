import Image from "next/image";
import { Fragment, Key, ReactElement } from "react";

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
}

export default function Table<T extends { key: Key }>({ columns, dataSource }: Props<T>) {
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
    <div className="overflow-x-auto">
      <div className="w-full min-w-[800px]">
        {/* table header */}
        <div
          className="px-middle py-large bg-app-black grid gap-middle text-xs font-bold text-white"
          style={{ gridTemplateColumns: templateCols }}
        >
          {columns.map(({ key, title }) => (
            <Fragment key={key}>{title}</Fragment>
          ))}
        </div>
        {/* table body */}
        <>
          {dataSource.length ? (
            dataSource.map((row) => (
              <div
                key={row.key}
                className="grid gap-middle px-middle py-middle border-b border-b-white/20 text-sm font-light text-white"
                style={{ gridTemplateColumns: templateCols }}
              >
                {columns.map(({ key, dataIndex, render }) => (
                  <Fragment key={key}>
                    {render ? render(row) : <span className="truncate">{row[dataIndex]}</span>}
                  </Fragment>
                ))}
              </div>
            ))
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
