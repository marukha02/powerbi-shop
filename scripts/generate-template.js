const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

// Create a new workbook
const workbook = XLSX.utils.book_new();

// Sample data with headers
const data = [
  ['Date', 'Amount'],
  [new Date('2023-01-15'), 1500.00],
  [new Date('2023-02-20'), 2300.50],
  [new Date('2023-03-10'), 1800.75],
  [new Date('2024-01-18'), 2100.00],
  [new Date('2024-02-22'), 2800.25],
  [new Date('2024-03-12'), 1950.50],
];

// Create worksheet
const worksheet = XLSX.utils.aoa_to_sheet(data);

// Set column widths
worksheet['!cols'] = [
  { wch: 15 }, // Date column
  { wch: 12 }, // Amount column
];

// Add worksheet to workbook
XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales Data');

// Ensure public directory exists
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Write file
const filePath = path.join(publicDir, 'template.xlsx');
XLSX.writeFile(workbook, filePath);

console.log(`Template file created at: ${filePath}`);






