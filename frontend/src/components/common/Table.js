import React from 'react';

export const Table = ({ columns = [], data = [], renderActions, emptyMessage = 'No data found', caption = null }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center p-6 text-on-surface-variant">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg">
        {caption && <caption className="text-left text-sm font-medium text-on-surface mb-2">{caption}</caption>}
        <thead className="bg-surface-container">
          <tr>
            {columns.map((col) => (
              <th key={col.key} scope="col" className="text-left px-4 py-3 text-sm font-semibold text-on-surface">{col.label}</th>
            ))}
            {renderActions && <th scope="col" className="px-4 py-3 text-left text-sm font-semibold">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={row._id || idx} className="hover:bg-surface-bright">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-sm text-on-surface">{col.render ? col.render(row) : row[col.key]}</td>
              ))}
              {renderActions && <td className="px-4 py-3">{renderActions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
