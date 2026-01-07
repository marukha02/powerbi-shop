'use client';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface ParsedData {
  date: Date;
  amount: number;
}

interface AnalyticsDashboardProps {
  data: ParsedData[];
}

interface MonthlyData {
  month: string;
  currentYear: number;
  previousYear: number;
}

export default function AnalyticsDashboard({ data }: AnalyticsDashboardProps) {
  const { chartData, totalRevenue, topMonth } = useMemo(() => {
    // Group data by year and month
    const byYearMonth: Record<string, Record<number, number>> = {};

    data.forEach(({ date, amount }) => {
      const year = date.getFullYear();
      const month = date.getMonth(); // 0-11

      if (!byYearMonth[year]) {
        byYearMonth[year] = {};
      }
      if (!byYearMonth[year][month]) {
        byYearMonth[year][month] = 0;
      }
      byYearMonth[year][month] += amount;
    });

    const years = Object.keys(byYearMonth).map(Number).sort();
    const currentYear = years[years.length - 1] || new Date().getFullYear();
    const previousYear = years[years.length - 2] || currentYear - 1;

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const chartData: MonthlyData[] = monthNames.map((month, index) => ({
      month,
      currentYear: byYearMonth[currentYear]?.[index] || 0,
      previousYear: byYearMonth[previousYear]?.[index] || 0,
    }));

    const totalRevenue = data.reduce((sum, { amount }) => sum + amount, 0);
    
    const topMonthData = chartData.reduce((max, item) => {
      const total = item.currentYear + item.previousYear;
      return total > max.total ? { month: item.month, total } : max;
    }, { month: 'Jan', total: 0 });

    return { chartData, totalRevenue, topMonth: topMonthData.month };
  }, [data]);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60 text-sm">Total Revenue</span>
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-white">
            ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60 text-sm">Top Month</span>
            <Calendar className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-white">{topMonth}</p>
        </motion.div>
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-xl p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-6">Monthly Sales Comparison</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="month" 
              stroke="rgba(255,255,255,0.6)"
              tick={{ fill: 'rgba(255,255,255,0.6)' }}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.6)"
              tick={{ fill: 'rgba(255,255,255,0.6)' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0,0,0,0.8)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#fff',
              }}
              formatter={(value: number | undefined) => value !== undefined ? `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ''}
            />
            <Legend 
              wrapperStyle={{ color: 'rgba(255,255,255,0.8)' }}
            />
            <Bar 
              dataKey="currentYear" 
              fill="#3b82f6" 
              name="Current Year"
              radius={[8, 8, 0, 0]}
            />
            <Bar 
              dataKey="previousYear" 
              fill="#6b7280" 
              name="Previous Year"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}






