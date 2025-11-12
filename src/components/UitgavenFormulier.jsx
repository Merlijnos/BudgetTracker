import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';

export default function UitgavenFormulier() {
  const [bedrag, setBedrag] = useState('');
  const [beschrijving, setBeschrijving] = useState('');
  const [categorie, setCategorie] = useState('boodschappen');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { currentUser } = useAuth();

  const uitgaveToevoegen = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    const bedragNum = parseFloat(bedrag);
    if (isNaN(bedragNum) || bedragNum <= 0 || !beschrijving.trim()) {
      setError('Voer geldige gegevens in');
      return;
    }

    try {
      const now = new Date();
      await addDoc(collection(db, 'uitgaven'), {
        bedrag: bedragNum,
        beschrijving: beschrijving.trim(),
        categorie,
        userId: currentUser.uid,
        datum: now.toISOString(),
        maand: now.getMonth() + 1,
        jaar: now.getFullYear()
      });

      setBedrag('');
      setBeschrijving('');
      setCategorie('boodschappen');
      setSuccess(true);
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setError('Fout bij toevoegen uitgave');
    }
  };

  return (
    <div className="form-wrapper">
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">Uitgave succesvol toegevoegd!</div>}
      <form onSubmit={uitgaveToevoegen} className="form-container">
        <input
          type="number"
          value={bedrag}
          onChange={(e) => setBedrag(e.target.value)}
          placeholder="Bedrag"
          step="0.01"
          min="0"
          required
        />
        <input
          type="text"
          value={beschrijving}
          onChange={(e) => setBeschrijving(e.target.value)}
          placeholder="Beschrijving"
          required
        />
        <select 
          value={categorie}
          onChange={(e) => setCategorie(e.target.value)}
        >
          <option value="boodschappen">🛒 Boodschappen</option>
          <option value="wonen">🏠 Wonen</option>
          <option value="dienst">💼 Dienst</option>
          <option value="sport">⚽ Sport</option>
          <option value="transport">🚗 Transport</option>
          <option value="entertainment">🎮 Entertainment</option>
          <option value="overig">📦 Overig</option>
        </select>
        <button type="submit">Uitgave Toevoegen</button>
      </form>
    </div>
  );
}