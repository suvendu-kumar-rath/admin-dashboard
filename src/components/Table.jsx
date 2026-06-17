export const Table = ({ columns, data, actions }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700">
            {columns.map((column) => (
              <th
                key={column}
                className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-gray-700 hover:bg-black/30 transition-colors"
            >
              {columns.map((column) => (
                <td
                  key={`${rowIndex}-${column}`}
                  className="px-6 py-4 text-sm text-gray-300"
                >
                  {row[column.toLowerCase().replace(" ", "")] || row[column.toLowerCase()] || "-"}
                </td>
              ))}
              {actions && (
                <td className="px-6 py-4 text-sm flex gap-2">
                  {actions(row)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
