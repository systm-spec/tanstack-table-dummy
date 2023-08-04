/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  Row,
} from "@tanstack/react-table";
import testData from "../testData.json";
import { FC, useState } from "react";
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from "react-icons/ai";
import { BsArrowDownShort, BsArrowUpShort } from "react-icons/bs";
import { useDrag, useDrop } from "react-dnd";

type Job = {
  id: number;
  job_title: string;
  company_name: string;
  priority: string;
  deadline: string;
  status: string;
  subRows?: Job[];
};

export default function BasicTable() {
  // const data = useMemo(() => testData, []);

  const [data, setData] = useState(() => testData);
  // const rerender = () => setData(() => testData);

  const columns: ColumnDef<Job>[] = [
    {
      header: "ID",
      accessorKey: "id",
      footer: "ID",
    },
    {
      header: "Job",
      accessorKey: "job_title",
      footer: "Job",
    },
    {
      header: "Company",
      accessorKey: "company_name",
      footer: "Company",
    },
    {
      header: "Priority",
      accessorKey: "priority",
      footer: "Priority",
    },
    {
      header: "Status",
      accessorKey: "status",
      footer: "Status",
    },
    {
      header: "Deadline",
      accessorKey: "deadline",
      footer: "Deadline",
      cell: (cell) => cell.getValue().split("/"), // An example to format a col
    },

    // Combine 2 cols example:
    // {
    //   header: "First Name",
    //   accessorKey: "first_name",
    //   footer: "First Name",
    // },
    // {
    //   header: "Last Name",
    //   accessorKey: "last_name",
    //   footer: "Last Name",
    // },
    // {
    //   header: "Name",
    //   accessorFn: (row) => ` ${row.first_name}  ${row.last_name}`,  // accessorFn: (callback)
    //   footer: "Name",
    // },

    // nested headerGroups example.
    // Note: You need to add 'header.isPlaceholder ? null : flexRender()' ternary to header flexRender.
    // {
    //   header: "Positions",
    //   columns: [
    //     {
    //       header: "Job Title",
    //       accessorKey: "first_name",
    //       footer: "Job Title",
    //     },
    //     {
    //       header: "Company",
    //       accessorKey: "last_name",
    //       footer: "Company",
    //     },
    //   ],
    // },
    // {
    //   header: "Mail",
    //   accessorKey: "email",
    //   footer: "Mail",
    // },
  ];

  const DraggableRow: FC<{
    row: Row<Job>;
    reorderRow: (draggedRowIndex: number, targetRowIndex: number) => void;
  }> = ({ row, reorderRow }) => {
    const [, dropRef] = useDrop({
      accept: "row",
      drop: (draggedRow: Row<Job>) => reorderRow(draggedRow.index, row.index),
    });

    const [{ isDragging }, dragRef, previewRef] = useDrag({
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      item: () => row,
      type: "row",
    });

    return (
      <tr
        ref={dropRef}
        // ref={previewRef} //previewRef could go here
        style={{ opacity: isDragging ? 0.5 : 1 }}
      >
        <div className="ref" ref={dragRef}></div>

        {row.getVisibleCells().map((cell) => (
          <td key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        ))}
      </tr>
    );
  };

  const [sorting, setSorting] = useState([]);
  const [filter, setFilter] = useState("");

  const reorderRow = (draggedRowIndex: number, targetRowIndex: number) => {
    data.splice(targetRowIndex, 0, data.splice(draggedRowIndex, 1)[0] as Job);
    setData([...data]);
  };

  const exampleTable = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: (row) => row.id,
    state: {
      sorting: sorting,
      globalFilter: filter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFilter,
  });

  let columnBeingDragged: number;

  const onDragStartCols = (e: DragEvent<HTMLElement>): void => {
    columnBeingDragged = Number(e.currentTarget.dataset.columnIndex);
  };

  const onDropCols = (e: DragEvent<HTMLElement>): void => {
    e.preventDefault();
    const newPosition = Number(e.currentTarget.dataset.columnIndex);
    const currentCols = exampleTable.getVisibleLeafColumns().map((c) => c.id);
    const colToBeMoved = currentCols.splice(columnBeingDragged, 1);

    currentCols.splice(newPosition, 0, colToBeMoved[0]);
    exampleTable.setColumnOrder(currentCols);
  };

  return (
    <div className="w3-container">
      <input
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      <table className="w3-table-all w3-hoverable">
        <thead>
          {exampleTable.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  // draggable={
                  //   !exampleTable.getState().columnSizingInfo.isResizingColumn
                  // }
                  // data-column-index={header.index}
                  // onDragStart={onDragStartCols}
                  // onDragOver={(e): void => {
                  //   e.preventDefault();
                  // }}
                  // onDrop={onDropCols}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  {
                    { asc: <BsArrowUpShort />, desc: <BsArrowDownShort /> }[
                      header.column.getIsSorted() ?? null
                    ]
                  }
                </th>
              ))}
            </tr>
          ))}
        </thead>
        {/* <tbody>
          {exampleTable.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  draggable={true}
                  data-row-index={row.index}
                  // onDragStart={onDragStartRows}
                  onDragOver={(e): void => {
                    e.preventDefault();
                  }}
                  // onDrop={onDropRows}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody> */}
        <tbody>
          {exampleTable.getRowModel().rows.map((row) => (
            <DraggableRow key={row.id} row={row} reorderRow={reorderRow} />
          ))}
        </tbody>
      </table>
      <div>
        <button onClick={() => exampleTable.setPageIndex(0)}>
          {" "}
          First Page
        </button>
        <button
          onClick={() => exampleTable.previousPage()}
          disabled={!exampleTable.getCanPreviousPage()}
        >
          <AiOutlineMinusCircle />
        </button>
        <button
          onClick={() => exampleTable.nextPage()}
          disabled={!exampleTable.getCanNextPage()}
        >
          <AiOutlinePlusCircle />
        </button>
        <button
          onClick={() =>
            exampleTable.setPageIndex(exampleTable.getPageCount() - 1)
          }
        >
          {" "}
          Last Page{" "}
        </button>
      </div>
    </div>
  );
}
