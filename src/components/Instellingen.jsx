import React, { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

export default function Instellingen() {
  const [maandelijksBudget, setMaandelijksBudget] = useState('2000');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { currentUser } = useAuth();
  const db = getFirestore();

  useEffect(() => {
    const laadInstellingen = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const instellingenRef = doc(db, 'gebruikersinstellingen', currentUser.uid);
        const instellingenDoc = await getDoc(instellingenRef);
        
        if (instellingenDoc.exists()) {
          setMaandelijksBudget(instellingenDoc.data().maandelijksBudget.toString());
        } else {
          // Maak een nieuw instellingen document aan als het nog niet bestaat
          await setDoc(instellingenRef, {
            maandelijksBudget: 2000
          });
        }
        setError('');
      } catch (error) {
        console.error('Fout bij laden instellingen:', error);
        setError('Kon instellingen niet laden');
      } finally {
        setLoading(false);
      }
    };

    laadInstellingen();
  }, [currentUser, db]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      const budget = parseFloat(maandelijksBudget);
      if (isNaN(budget) || budget <= 0) {
        setError('Voer een geldig budget in');
        return;
      }

      const instellingenRef = doc(db, 'gebruikersinstellingen', currentUser.uid);
      await setDoc(instellingenRef, {
        maandelijksBudget: budget,
        laatstBijgewerkt: serverTimestamp()
      }, { merge: true });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Fout bij opslaan instellingen:', error);
      setError('Kon instellingen niet opslaan');
    }
  };

  if (loading) return <div className="loading">Laden...</div>;

  return (
    <div className="instellingen-container">
      <h2>Instellingen</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">Instellingen opgeslagen!</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="maandelijks-budget">Maandelijks Budget (€)</label>
          <input
            id="maandelijks-budget"
            type="number"
            value={maandelijksBudget}
            onChange={(e) => setMaandelijksBudget(e.target.value)}
            min="0"
            step="0.01"
            required
          />
        </div>
        <button type="submit">Instellingen Opslaan</button>
      </form>
    </div>
  );
}