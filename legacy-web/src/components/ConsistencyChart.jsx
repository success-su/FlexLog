import { useMemo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { weeklyConsistency, currentStreak } from '../lib/dates'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip)

const COLORS = {
  light: { gridline: '#e1e0d9', axisText: '#898781', series: '#2a78d6' },
  dark: { gridline: '#3f3f46', axisText: '#a1a1aa', series: '#60a5fa' },
}

export function ConsistencyChart({ entries, dark = false }) {
  const weeks = useMemo(() => weeklyConsistency(entries, 10), [entries])
  const streak = useMemo(() => currentStreak(entries), [entries])
  const { gridline: GRIDLINE, axisText: AXIS_TEXT, series: SERIES } =
    dark ? COLORS.dark : COLORS.light

  const data = {
    labels: weeks.map((w) => w.label),
    datasets: [
      {
        label: 'Days trained',
        data: weeks.map((w) => w.days),
        backgroundColor: SERIES,
        borderRadius: 4,
        maxBarThickness: 28,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.parsed.y} day${ctx.parsed.y === 1 ? '' : 's'} trained`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: AXIS_TEXT, font: { size: 11 } },
      },
      y: {
        beginAtZero: true,
        max: 7,
        ticks: { stepSize: 1, color: AXIS_TEXT, font: { size: 11 } },
        grid: { color: GRIDLINE },
        border: { display: false },
      },
    },
  }

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
          Consistency — days trained per week
        </h2>
        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          🔥 {streak} day streak
        </span>
      </div>
      <div className="h-60 sm:h-64">
        <Bar data={data} options={options} />
      </div>
    </div>
  )
}
