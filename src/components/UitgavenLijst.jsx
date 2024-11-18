import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, onSnapshot, deleteDoc, doc} from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import UitgavenFilter from './UitgavenFilter';
import ConfirmDialog from './ConfirmDialog';
import UitgavenSortering from './UitgavenSortering';

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
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    uitgaveId: null
  });
  const [sorteerOptie, setSorteerOptie] = useState({
    veld: 'datum',
    richting: 'desc'
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

  const handleVerwijder = (uitgaveId) => {
    setConfirmDialog({
      isOpen: true,
      uitgaveId
    });
  };

  const verwijderUitgave = async () => {
    if (!currentUser || !confirmDialog.uitgaveId) return;
    
    try {
      setError('');
      const uitgaveRef = doc(db, 'uitgaven', confirmDialog.uitgaveId);
      await deleteDoc(uitgaveRef);
      setConfirmDialog({ isOpen: false, uitgaveId: null });
    } catch (error) {
      console.error('Fout bij verwijderen:', error);
      setError('Fout bij verwijderen uitgave.');
    }
  };

  const sorterenUitgaven = (uitgaven) => {
    return [...uitgaven].sort((a, b) => {
      let vergelijking;

      switch (sorteerOptie.veld) {
        case 'datum':
          vergelijking = new Date(b.datum) - new Date(a.datum);
          return sorteerOptie.richting === 'desc' ? vergelijking : -vergelijking;
        case 'bedrag':
          vergelijking = b.bedrag - a.bedrag;
          return sorteerOptie.richting === 'desc' ? vergelijking : -vergelijking;
        case 'categorie':
          vergelijking = a.categorie.localeCompare(b.categorie);
          return sorteerOptie.richting === 'desc' ? -vergelijking : vergelijking;
        default:
          return 0;
      }
    });
  };

  return (
    <div className="uitgaven-lijst">
      <h2>Uitgaven Overzicht</h2>
      <UitgavenFilter filters={filters} setFilters={setFilters} />
      <UitgavenSortering sorteerOptie={sorteerOptie} setSorteerOptie={setSorteerOptie} />
      
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, uitgaveId: null })}
        onConfirm={verwijderUitgave}
        title="Uitgave Verwijderen"
        message="Weet je zeker dat je deze uitgave wilt verwijderen?"
      />
      
      {loading ? (
        <div className="loading">Laden...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : uitgaven.length === 0 ? (
        <p>Geen uitgaven gevonden.</p>
      ) : (
        sorterenUitgaven(uitgaven).map((uitgave) => (
          <div key={uitgave.id} className="uitgave-item">
            <div className="uitgave-content">
              <p className="uitgave-bedrag">€{uitgave.bedrag.toFixed(2)} - {uitgave.beschrijving}</p>
              <p className="uitgave-meta">
                {new Date(uitgave.datum).toLocaleDateString('nl-NL')} | 
                Categorie: {uitgave.categorie}
              </p>
            </div>
            <button 
              onClick={() => handleVerwijder(uitgave.id)}
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