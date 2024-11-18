import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
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
  const db = getFirestore();

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

        // Bereken uitgaven per categorie
        const perCategorie = uitgaven.reduce((acc, uitgave) => {
          acc[uitgave.categorie] = (acc[uitgave.categorie] || 0) + uitgave.bedrag;
          return acc;
        }, {});

        // Bereken uitgaven per maand
        const perMaand = uitgaven.reduce((acc, uitgave) => {
          acc[uitgave.maand] = (acc[uitgave.maand] || 0) + uitgave.bedrag;
          return acc;
        }, {});

        // Vind top uitgaven
        const top = [...uitgaven]
          .sort((a, b) => b.bedrag - a.bedrag)
          .slice(0, 5);

        setUitgavenPerCategorie(perCategorie);
        setUitgavenPerMaand(perMaand);
        setTopUitgaven(top);
        setLoading(false);
      } catch (error) {
        console.error('Fout bij laden statistieken:', error);
        setLoading(false);
      }
    };

    laadStatistieken();
  }, [currentUser, db]);

  const pieData = {
    labels: Object.keys(uitgavenPerCategorie),
    datasets: [{
      data: Object.values(uitgavenPerCategorie),
      backgroundColor: [
        '#4299E1',
        '#48BB78',
        '#ED8936',
        '#9F7AEA',
        '#F56565'
      ]
    }]
  };

  const lineData = {
    labels: Object.keys(uitgavenPerMaand).map(m => `Maand ${m}`),
    datasets: [{
      label: 'Uitgaven per maand',
      data: Object.values(uitgavenPerMaand),
      borderColor: '#4299E1',
      tension: 0.1
    }]
  };

  if (loading) return <div className="loading">Laden...</div>;

  return (
    <div className="statistieken-container">
      <h2>Statistieken</h2>
      
      <div className="stats-grid">
        <div className="stats-card">
          <h3>Uitgaven per Categorie</h3>
          <Pie data={pieData} />
        </div>
        
        <div className="stats-card">
          <h3>Uitgaven over Tijd</h3>
          <Line data={lineData} />
        </div>

        <div className="stats-card">
          <h3>Top 5 Uitgaven</h3>
          <ul className="top-uitgaven">
            {topUitgaven.map((uitgave, index) => (
              <li key={index}>
                <span className="uitgave-beschrijving">{uitgave.beschrijving}</span>
                <span className="uitgave-bedrag">€{uitgave.bedrag.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
