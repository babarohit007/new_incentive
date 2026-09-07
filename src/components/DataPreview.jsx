// Part 1 stops here: prove every sheet is reachable and show the raw rows.
// The incentive calculations (Part 2) will consume `results` instead of
// this component rendering it directly.
export default function DataPreview({ results }) {
  return (
    <div className="data-preview">
      {results.map((sheet) => (
        <div key={sheet.key} className="sheet-block">
          <div className="sheet-block-header">
            <h3>{sheet.label}</h3>
            {sheet.ok ? (
              <span className="badge badge-ok">{sheet.values.length} rows</span>
            ) : (
              <span className="badge badge-error">error</span>
            )}
          </div>
          {!sheet.ok && <p className="error-text">{sheet.error}</p>}
          {sheet.ok && sheet.values.length > 0 && (
            <div className="table-scroll">
              <table>
                <tbody>
                  {sheet.values.slice(0, 5).map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td key={j}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {sheet.values.length > 5 && (
                <p className="muted small">…and {sheet.values.length - 5} more rows</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
