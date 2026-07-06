import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { formatDate } from '../../utils/validators';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const WeightLineChart = ({ progressData }) => {
  const sorted = [...progressData].sort((a, b) => new Date(a.date) - new Date(b.date));

  const data = {
    labels: sorted.map((p) => formatDate(p.date)),
    datasets: [
      {
        label: 'Weight (kg)',
        data: sorted.map((p) => p.weight),
        borderColor: '#0d6efd',
        backgroundColor: 'rgba(13, 110, 253, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: '#0d6efd',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      title: { display: true, text: 'Weight Progress', font: { size: 16 } },
    },
    scales: {
      y: { beginAtZero: false },
    },
  };

  if (sorted.length === 0) {
    return (
      <div className="text-center text-muted py-5">
        No weight data yet. Start tracking your progress!
      </div>
    );
  }

  return (
    <div className="chart-container">
      <Line data={data} options={options} />
    </div>
  );
};

export default WeightLineChart;
