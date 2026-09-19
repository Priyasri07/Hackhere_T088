import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Global Dark Theme defaults for Chart.js
ChartJS.defaults.color = '#94a3b8';
ChartJS.defaults.borderColor = 'rgba(255, 255, 255, 0.06)';
ChartJS.defaults.font.family = "'Inter', sans-serif";
ChartJS.defaults.plugins.tooltip.backgroundColor = '#0d1527';
ChartJS.defaults.plugins.tooltip.titleColor = '#f1f5f9';
ChartJS.defaults.plugins.tooltip.bodyColor = '#cbd5e1';
ChartJS.defaults.plugins.tooltip.borderColor = 'rgba(255, 255, 255, 0.15)';
ChartJS.defaults.plugins.tooltip.borderWidth = 1;
ChartJS.defaults.plugins.tooltip.padding = 10;
ChartJS.defaults.plugins.tooltip.cornerRadius = 6;
