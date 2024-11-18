import React from 'react';
import DashboardOverview from './DashboardOverview';
import UitgavenLijst from './UitgavenLijst';
import UitgavenFormulier from './UitgavenFormulier';

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <DashboardOverview />
      <UitgavenFormulier />
      <UitgavenLijst />
    </div>
  );
}