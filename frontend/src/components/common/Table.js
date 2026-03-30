import React from 'react';

export const Table = ({ columns = [], data = [], renderActions, emptyMessage = 'No data found' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-border mt-4">
        <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-on-surface-variant" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <p className="text-on-surface-variant font-medium">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-white shadow-sm mt-4">
      <table className="min-w-full text-left border-collapse">
        <thead>
          <tr className="bg-surface-container text-on-surface text-sm leading-normal border-b border-border font-semibold uppercase tracking-wider">
            {columns.map((col) => (
              <th key={col.key} className="py-4 px-6 sticky top-0 bg-surface-container whitespace-nowrap">{col.label}</th>
            ))}
            {renderActions && <th className="py-4 px-6 sticky top-0 bg-surface-container text-right">Actions</th>}
          </tr>
        </thead>
        <tbody className="text-on-surface-variant text-sm font-medium">
          {data.map((row, idx) => (
            <tr key={row._id || idx} className="border-b border-border/50 hover:bg-primary/5 transition duration-150 ease-in-out">
              {columns.map((col) => (
                <td key={col.key} className="py-4 px-6 whitespace-nowrap">
                  {col.render ? col.render(row) : (row[col.key] || '-')}
                </td>
              ))}
              {renderActions && (
                <td className="py-4 px-6 text-right whitespace-nowrap">
                  <div className="flex justify-end items-center space-x-2">
                    {renderActions(row)}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
