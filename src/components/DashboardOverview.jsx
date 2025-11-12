import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { db } from '../firebase';

export default function DashboardOverview() {
  const [totalen, setTotalen] = useState({
    inkomsten: 0,
    uitgaven: 0,
    balans: 0,
    percentage: 0
  });
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const instellingenRef = doc(db, 'gebruikersinstellingen', currentUser.uid);
    const unsubscribeInstellingen = onSnapshot(instellingenRef, (instellingenDoc) => {
      const maandelijksBudget = instellingenDoc.exists() 
        ? instellingenDoc.data().maandelijksBudget 
        : 2000;

      const uitgavenRef = collection(db, 'uitgaven');
      const q = query(
        uitgavenRef,
        where('userId', '==', currentUser.uid),
        where('maand', '==', startOfMonth.getMonth() + 1),
        where('jaar', '==', startOfMonth.getFullYear())
      );

      const unsubscribeUitgaven = onSnapshot(q, (snapshot) => {
        const totaalUitgaven = snapshot.docs.reduce((sum, doc) => {
          const uitgave = doc.data();
          return sum + uitgave.bedrag;
        }, 0);

        const balans = maandelijksBudget - totaalUitgaven;
        const percentage = Math.min(100, (totaalUitgaven / maandelijksBudget) * 100);

        setTotalen({
          inkomsten: maandelijksBudget,
          uitgaven: totaalUitgaven,
          balans: balans,
          percentage: percentage
        });
        setLoading(false);
      });

      return () => unsubscribeUitgaven();
    });

    return () => {
      unsubscribeInstellingen();
    };
  }, [currentUser]);

  if (loading) return <div className="loading">Laden...</div>;

  return (
    <div className="dashboard-overview">
      <div className="overview-cards">
        <div className="overview-card income">
          <h3>Maandelijks Budget</h3>
          <p className="amount">€{totalen.inkomsten.toFixed(2)}</p>
        </div>
        <div className="overview-card expenses">
          <h3>Totaal Uitgaven</h3>
          <p className="amount">€{totalen.uitgaven.toFixed(2)}</p>
        </div>
        <div className="overview-card balance">
          <h3>Resterend Budget</h3>
          <p className="amount">€{totalen.balans.toFixed(2)}</p>
        </div>
      </div>
      
      <div className="progress-section">
        <div className="progress-container">
          <CircularProgressbar
            value={totalen.percentage}
            text={`${totalen.percentage.toFixed(0)}%`}
            styles={buildStyles({
              pathColor: totalen.percentage > 90 ? '#ff4444' : '#4CAF50',
              textColor: '#1a1a1a',
              trailColor: '#d6d6d6'
            })}
          />
          <p className="progress-label">Budget Gebruikt</p>
        </div>
      </div>
    </div>
  );
}