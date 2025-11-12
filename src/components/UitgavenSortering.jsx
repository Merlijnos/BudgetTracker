import React from 'react';

export default function UitgavenSortering({ sorteerOptie, setSorteerOptie }) {
  return (
    <div className="sorteer-opties">
      <select
        value={`${sorteerOptie.veld}-${sorteerOptie.richting}`}
        onChange={(e) => {
          const [veld, richting] = e.target.value.split('-');
          setSorteerOptie({ veld, richting });
        }}
      >
        <option value="datum-desc">Datum (nieuwste eerst)</option>
        <option value="datum-asc">Datum (oudste eerst)</option>
        <option value="bedrag-desc">Bedrag (hoogste eerst)</option>
        <option value="bedrag-asc">Bedrag (laagste eerst)</option>
        <option value="categorie-asc">Categorie (A-Z)</option>
        <option value="categorie-desc">Categorie (Z-A)</option>
      </select>
    </div>
  );
}