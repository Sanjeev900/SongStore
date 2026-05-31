import React, { useMemo } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { buildDurationHistogram, buildScatterData, buildGroupedBarData } from '../utils/chartUtils';

/**
 * Charts component displaying scatter, histogram, and grouped bar charts.
 */
function Charts({ allSongs }) {
  const scatterData = useMemo(() => buildScatterData(allSongs), [allSongs]);
  const histogramData = useMemo(() => buildDurationHistogram(allSongs), [allSongs]);
  const groupedBarData = useMemo(() => buildGroupedBarData(allSongs), [allSongs]);

  if (!allSongs || allSongs.length === 0) {
    return <p className="empty-state">No data available for charts.</p>;
  }

  return (
    <div className="charts-container">
      <section className="chart-section">
        <h3>Danceability vs Tempo</h3>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid />
            <XAxis type="number" dataKey="danceability" name="Danceability" />
            <YAxis type="number" dataKey="tempo" name="Tempo" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter name="Songs" data={scatterData} fill="#8884d8" />
          </ScatterChart>
        </ResponsiveContainer>
      </section>

      <section className="chart-section">
        <h3>Song Duration Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={histogramData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section className="chart-section">
        <h3>Acousticness + Tempo by Song</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={groupedBarData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="title" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="acousticness" fill="#8884d8" />
            <Bar dataKey="tempo" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
}

export default Charts;
