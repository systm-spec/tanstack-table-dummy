function SortableItem() {
  return (
    <table>
      <thead>
        <tr>
          <th></th>
        </tr>
      </thead>

      <tbody>
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
      </tbody>
    </table>
  );
}

export default SortableItem;
