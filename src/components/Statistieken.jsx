import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

export default function Statistieken() {
  const [uitgavenPerCategorie, setUitgavenPerCategorie] = useState({});
  const [uitgavenPerMaand, setUitgavenPerMaand] = useState({});
  const [topUitgaven, setTopUitgaven] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const laadStatistieken = async () => {
      if (!currentUser) return;

      try {
        const uitgavenRef = collection(db, 'uitgaven');
        const q = query(
          uitgavenRef,
          where('userId', '==', currentUser.uid),
          where('jaar', '==', new Date().getFullYear())
        );

        const snapshot = await getDocs(q);
        const uitgaven = snapshot.docs.map(doc => doc.data());

        const perCategorie = uitgaven.reduce((acc, uitgave) => {
          acc[uitgave.categorie] = (acc[uitgave.categorie] || 0) + uitgave.bedrag;
          return acc;
        }, {});

        const perMaand = uitgaven.reduce((acc, uitgave) => {
          acc[uitgave.maand] = (acc[uitgave.maand] || 0) + uitgave.bedrag;
          return acc;
        }, {});

        const top = [...uitgaven]
          .sort((a, b) => b.bedrag - a.bedrag)
          .slice(0, 5);

        setUitgavenPerCategorie(perCategorie);
        setUitgavenPerMaand(perMaand);
        setTopUitgaven(top);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    laadStatistieken();
  }, [currentUser]);

  const pieChartConfig = {
    data: {
      labels: Object.keys(uitgavenPerCategorie),
      datasets: [{
        data: Object.values(uitgavenPerCategorie),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ],
        borderWidth: 1
      }]
    },
    options: {
      plugins: {
        legend: {
          position: 'right',
          labels: {
            padding: 20,
            font: {
              size: 12
            }
          }
        },
        title: {
          display: true,
          text: 'Uitgaven per Categorie',
          font: {
            size: 16
          }
        }
      }
    }
  };

  const lineChartConfig = {
    data: {
      labels: Object.keys(uitgavenPerMaand).map(maand => 
        new Date(2024, parseInt(maand) - 1).toLocaleString('nl-NL', { month: 'long' })
      ),
      datasets: [{
        label: 'Uitgaven per Maand',
        data: Object.values(uitgavenPerMaand),
        fill: false,
        borderColor: '#36A2EB',
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Uitgaven Trend'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: value => `€${value}`
          }
        }
      }
    }
  };

  if (loading) return <div className="loading">Laden...</div>;

  return (
    <div className="statistieken-container">
      <h2>Statistieken</h2>
      
      <div className="stats-grid">
        <div className="stats-card">
          <Pie data={pieChartConfig.data} options={pieChartConfig.options} />
        </div>
        
        <div className="stats-card">
          <Line data={lineChartConfig.data} options={lineChartConfig.options} />
        </div>

        <div className="stats-card">
          <h3>Top 5 Uitgaven</h3>
          <ul className="top-uitgaven-lijst">
            {topUitgaven.map((uitgave, index) => (
              <li key={index} className="top-uitgave-item">
                <div className="uitgave-rang">{index + 1}</div>
                <div className="uitgave-details">
                  <span className="uitgave-beschrijving">{uitgave.beschrijving}</span>
                  <span className="uitgave-meta">
                    {new Date(uitgave.datum).toLocaleDateString('nl-NL')}
                  </span>
                </div>
                <div className="uitgave-bedrag">€{uitgave.bedrag.toFixed(2)}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
