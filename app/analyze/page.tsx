'use client';

import { useState, useCallback } from 'react';
import { Download, Upload, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import * as XLSX from 'xlsx';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';

interface ParsedData {
  date: Date;
  amount: number;
}

export default function AnalyzePage() {
  const [data, setData] = useState<ParsedData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const validateAndParseFile = (file: File): Promise<ParsedData[]> => {
    return new Promise((resolve, reject) => {
      if (file.name.endsWith('.csv')) {
        // Handle CSV files
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const text = e.target?.result as string;
            const lines = text.split('\n').filter(line => line.trim());
            if (lines.length === 0) {
              reject(new Error('File is empty'));
              return;
            }

            const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
            const dateIndex = headers.findIndex(h => h === 'date');
            const amountIndex = headers.findIndex(h => h === 'amount');

            if (dateIndex === -1 || amountIndex === -1) {
              reject(new Error('Invalid format. Please use the template.'));
              return;
            }

            const parsedData: ParsedData[] = [];
            for (let i = 1; i < lines.length; i++) {
              const values = lines[i].split(',').map(v => v.trim());
              const dateValue = values[dateIndex];
              const amountValue = values[amountIndex];

              if (!dateValue || !amountValue) continue;

              const date = new Date(dateValue);
              const amount = parseFloat(amountValue);

              if (isNaN(date.getTime()) || isNaN(amount)) continue;

              parsedData.push({ date, amount });
            }

            if (parsedData.length === 0) {
              reject(new Error('No valid data found in file'));
              return;
            }

            resolve(parsedData);
          } catch (err) {
            reject(err instanceof Error ? err : new Error('Failed to parse CSV file'));
          }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        // Handle Excel files
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const workbook = XLSX.read(e.target?.result, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

            if (jsonData.length === 0) {
              reject(new Error('File is empty'));
              return;
            }

            // Check headers
            const headers = jsonData[0].map((h: any) => String(h).trim().toLowerCase());
            const dateIndex = headers.findIndex((h: string) => h === 'date');
            const amountIndex = headers.findIndex((h: string) => h === 'amount');

            if (dateIndex === -1 || amountIndex === -1) {
              reject(new Error('Invalid format. Please use the template.'));
              return;
            }

            // Parse data rows
            const parsedData: ParsedData[] = [];
            for (let i = 1; i < jsonData.length; i++) {
              const row = jsonData[i];
              if (!row || row.length === 0) continue;

              const dateValue = row[dateIndex];
              const amountValue = row[amountIndex];

              if (!dateValue || amountValue === undefined || amountValue === null) continue;

              let date: Date;
              if (dateValue instanceof Date) {
                date = dateValue;
              } else if (typeof dateValue === 'number') {
                // Excel date serial number (days since 1900-01-01)
                const excelEpoch = new Date(1899, 11, 30);
                date = new Date(excelEpoch.getTime() + dateValue * 24 * 60 * 60 * 1000);
              } else {
                date = new Date(dateValue);
              }

              const amount = typeof amountValue === 'number' ? amountValue : parseFloat(String(amountValue));

              if (isNaN(date.getTime()) || isNaN(amount)) continue;

              parsedData.push({ date, amount });
            }

            if (parsedData.length === 0) {
              reject(new Error('No valid data found in file'));
              return;
            }

            resolve(parsedData);
          } catch (err) {
            reject(err instanceof Error ? err : new Error('Failed to parse file'));
          }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsBinaryString(file);
      } else {
        reject(new Error('Unsupported file type. Please use .xlsx or .csv'));
      }
    });
  };

  const handleFile = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const parsedData = await validateAndParseFile(file);
      setData(parsedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file');
      setData([]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Monthly Sales Dynamics (Year over Year)
        </h1>
        <p className="text-lg text-white/60">
          Upload your data to visualize year-over-year sales performance
        </p>
      </div>

      {/* Step 1: Download Template */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl p-8 mb-8"
      >
        <h2 className="text-2xl font-semibold text-white mb-4">Step 1: Download Template</h2>
        <p className="text-white/60 mb-6">
          Fill this file with your data (Columns: Date, Amount)
        </p>
        <a
          href="/template.xlsx"
          download
          className="inline-flex items-center gap-2 bg-white text-zinc-950 px-6 py-3 rounded-lg font-medium hover:bg-white/90 transition-colors"
        >
          <Download className="w-5 h-5" />
          Download Excel Template
        </a>
      </motion.div>

      {/* Step 2: Upload Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-xl p-8 mb-8"
      >
        <h2 className="text-2xl font-semibold text-white mb-4">Step 2: Upload Your Data</h2>
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
            isDragging
              ? 'border-white/50 bg-white/5'
              : 'border-white/20 hover:border-white/30'
          }`}
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-white/60" />
          <p className="text-white mb-2">
            Drag & drop your file here, or{' '}
            <label className="text-white underline cursor-pointer hover:text-white/80">
              browse
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileInput}
                className="hidden"
                disabled={isProcessing}
              />
            </label>
          </p>
          <p className="text-sm text-white/40">Supports .xlsx, .xls, and .csv files</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex items-center gap-2 text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg p-4"
          >
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </motion.div>
        )}

        {data.length > 0 && !error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex items-center gap-2 text-green-400 bg-green-400/10 border border-green-400/20 rounded-lg p-4"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Successfully loaded {data.length} records</span>
          </motion.div>
        )}

        {isProcessing && (
          <div className="mt-4 text-center text-white/60">
            Processing file...
          </div>
        )}
      </motion.div>

      {/* Step 3: Dashboard */}
      {data.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold text-white mb-6">Step 3: Dashboard Visualization</h2>
          <AnalyticsDashboard data={data} />
        </motion.div>
      )}
    </div>
  );
}

