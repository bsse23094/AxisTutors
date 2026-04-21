import type { ReactNode } from 'react'

type DataTableProps = {
  headers: string[]
  rows: ReactNode[][]
}

export default function DataTable({ headers, rows }: DataTableProps) {
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <table className="data-table">
        <thead>
          <tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
          ))}
          {!rows.length && (
            <tr>
              <td colSpan={headers.length} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No data</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
