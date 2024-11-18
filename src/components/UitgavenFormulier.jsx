import React, { useState } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

export default function UitgavenFormulier() {
  const [bedrag, setBedrag] = useState('');
  const [beschrijving, setBeschrijving] = useState('');
  const [categorie, setCategorie] = useState('boodschappen');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { currentUser } = useAuth();
  const db = getFirestore();

  const uitgaveToevoegen = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    if (!currentUser) {
      setError('Je moet ingelogd zijn om uitgaven toe te voegen.');
      return;
    }

    try {
      const bedragNum = parseFloat(bedrag);
      if (isNaN(bedragNum) || bedragNum <= 0) {
        setError('Voer een geldig bedrag in');
        return;
      }

      if (!beschrijving.trim()) {
        setError('Voer een beschrijving in');
        return;
      }

      const now = new Date();
      const uitgave = {
        bedrag: bedragNum,
        beschrijving: beschrijving.trim(),
        categorie,
        userId: currentUser.uid,
        datum: now.toISOString(),
        maand: now.getMonth() + 1,
        jaar: now.getFullYear()
      };

      const uitgavenRef = collection(db, 'uitgaven');
      const docRef = await addDoc(uitgavenRef, uitgave);
      
      if (!docRef.id) {
        throw new Error('Geen document ID ontvangen');
      }

      // Reset form
      setBedrag('');
      setBeschrijving('');
      setCategorie('boodschappen');
      setSuccess(true);
      
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Fout bij toevoegen uitgave:', error);
      if (error.code === 'permission-denied') {
        setError('Je hebt geen toegang om uitgaven toe te voegen.');
      } else {
        setError('Er is iets misgegaan bij het toevoegen van de uitgave. Probeer het opnieuw.');
      }
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
          <option value="transport">🚗 Transport</option>
          <option value="entertainment">🎮 Entertainment</option>
          <option value="overig">📦 Overig</option>
        </select>
        <button type="submit">Uitgave Toevoegen</button>
      </form>
    </div>
  );
}