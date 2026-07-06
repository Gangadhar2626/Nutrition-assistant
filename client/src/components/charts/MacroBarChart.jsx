import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MacroBarChart = ({ label, consumed, target, color = '#0d6efd' }) => {
  const data = {
    labels: ['Consumed', 'Target'],
    datasets: [
      {
        label,
        data: [consumed, target],
        backgroundColor: [color, '#dee2e6'],
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: label, font: { size: 14 } },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="chart-container">
      <Bar data={data} options={options} />
    </div>
  );
};

export default MacroBarChart;
