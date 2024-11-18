import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, onSnapshot, deleteDoc, doc} from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import UitgavenFilter from './UitgavenFilter';

export default function UitgavenLijst() {
  const [uitgaven, setUitgaven] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();
  const db = getFirestore();
  const [filters, setFilters] = useState({
    maand: new Date().getMonth() + 1,
    jaar: new Date().getFullYear(),
    categorie: 'alle'
  });

  useEffect(() => {
    if (!currentUser) return;

    const uitgavenRef = collection(db, 'uitgaven');
    let queryConstraints = [
      where('userId', '==', currentUser.uid),
      where('jaar', '==', filters.jaar)
    ];

    if (filters.maand !== 'alle') {
      queryConstraints.push(where('maand', '==', filters.maand));
    }

    if (filters.categorie !== 'alle') {
      queryConstraints.push(where('categorie', '==', filters.categorie));
    }

    const q = query(uitgavenRef, ...queryConstraints);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      try {
        const nieuweUitgaven = snapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .sort((a, b) => new Date(b.datum) - new Date(a.datum));

        setUitgaven(nieuweUitgaven);
        setLoading(false);
        setError('');
      } catch (err) {
        console.error('Fout bij verwerken data:', err);
        setError('Fout bij verwerken uitgaven.');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [currentUser, db, filters]);

  const verwijderUitgave = async (uitgaveId) => {
    if (!currentUser) return;
    
    try {
      setError('');
      const uitgaveRef = doc(db, 'uitgaven', uitgaveId);
      await deleteDoc(uitgaveRef);
      
      const successMessage = document.createElement('div');
      successMessage.className = 'success-message';
      successMessage.textContent = 'Uitgave succesvol verwijderd';
      document.querySelector('.uitgaven-lijst').prepend(successMessage);
      setTimeout(() => {
        if (successMessage.parentNode) {
          successMessage.remove();
        }
      }, 3000);
    } catch (error) {
      console.error('Fout bij verwijderen:', error);
      setError('Fout bij verwijderen uitgave.');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="uitgaven-lijst">
      <h2>Uitgaven Overzicht</h2>
      <UitgavenFilter filters={filters} setFilters={setFilters} />
      
      {loading ? (
        <div className="loading">Laden...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : uitgaven.length === 0 ? (
        <p>Geen uitgaven gevonden.</p>
      ) : (
        uitgaven.map((uitgave) => (
          <div key={uitgave.id} className="uitgave-item">
            <div className="uitgave-content">
              <p className="uitgave-bedrag">€{uitgave.bedrag.toFixed(2)} - {uitgave.beschrijving}</p>
              <p className="uitgave-meta">
                {new Date(uitgave.datum).toLocaleDateString('nl-NL')} | 
                Categorie: {uitgave.categorie}
              </p>
            </div>
            <button 
              onClick={() => verwijderUitgave(uitgave.id)}
              className="verwijder-button"
            >
              Verwijderen
            </button>
          </div>
        ))
      )}
    </div>
  );
}