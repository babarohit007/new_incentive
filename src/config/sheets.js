// The 7 source sheets for the incentive engine.
//
// spreadsheetId: the long id in the sheet's URL —
//   https://docs.google.com/spreadsheets/d/<THIS PART>/edit
// range: an A1 notation range Sheets API will read (a whole tab name pulls
//   every used cell, e.g. "Daily Plan"; narrow it if a tab is huge).
//
// Fill these in with your real sheets before running the app — the values
// below are placeholders and will fail to fetch.
export const SHEET_SOURCES = [
  { key: 'sheet1', label: 'Sheet 1', spreadsheetId: 'PUT_SPREADSHEET_ID_HERE', range: 'Sheet1' },
  { key: 'sheet2', label: 'Sheet 2', spreadsheetId: 'PUT_SPREADSHEET_ID_HERE', range: 'Sheet1' },
  { key: 'sheet3', label: 'Sheet 3', spreadsheetId: 'PUT_SPREADSHEET_ID_HERE', range: 'Sheet1' },
  { key: 'sheet4', label: 'Sheet 4', spreadsheetId: 'PUT_SPREADSHEET_ID_HERE', range: 'Sheet1' },
  { key: 'sheet5', label: 'Sheet 5', spreadsheetId: 'PUT_SPREADSHEET_ID_HERE', range: 'Sheet1' },
  { key: 'sheet6', label: 'Sheet 6', spreadsheetId: 'PUT_SPREADSHEET_ID_HERE', range: 'Sheet1' },
  { key: 'sheet7', label: 'Sheet 7', spreadsheetId: 'PUT_SPREADSHEET_ID_HERE', range: 'Sheet1' },
]
