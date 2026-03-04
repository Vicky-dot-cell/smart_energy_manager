'use client';

import { useState, useEffect } from 'react';
import { Zap, Activity, Battery, TrendingUp } from 'lucide-react';
import { DashboardShell } from '@/components/DashboardShell';
import { StatCard } from '@/components/StatCard';
import { EnergyChart } from '@/components/EnergyChart';
import { RecentActivity } from '@/components/RecentActivity';
import { CostPredictedChart } from '@/components/CostPredictedChart';
import { CostChangeChart } from '@/components/CostChangeChart';
import { UsageEstimateChart } from '@/components/UsageEstimateChart';
import { ActiveAppliancesChart } from '@/components/ActiveAppliancesChart';
import { EnergyIntensityChart } from '@/components/EnergyIntensityChart';
import { api, type DashboardStats } from '@/lib/api';

export default function Home() {
  const [viewMode, setViewMode] = useState<'TODAY' | 'MONTH' | 'YEAR'>('TODAY');
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    api.stats().then(setStats).catch(console.error);
  }, []);

  const statCards = [
    { title: 'Current Voltage', icon: Zap, stat: stats?.voltage },
    { title: 'Current Load', icon: Activity, stat: stats?.current },
    { title: 'Power Usage', icon: Battery, stat: stats?.power },
    { title: 'Total Energy', icon: TrendingUp, stat: stats?.totalEnergy },
  ];

  return (
    <DashboardShell>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-100 mb-1">Dashboard</h1>
        </div>
        <div className="bg-neutral-800/50 inline-flex rounded-full p-1 border border-neutral-800">
          {(['TODAY', 'MONTH', 'YEAR'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-6 py-2 rounded-full text-xs font-semibold tracking-wider transition-all ${viewMode === mode
                ? 'bg-neutral-700 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-300'
                }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map(({ title, icon, stat }) => (
          <StatCard
            key={title}
            title={title}
            value={stat?.value ?? '—'}
            icon={icon}
            trend={stat?.trend ?? ''}
            trendUp={stat?.trendUp ?? true}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <EnergyChart range={viewMode} />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>

      {/* Detailed Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        <CostPredictedChart />
        <CostChangeChart />
        <UsageEstimateChart />
      </div>

      {/* Appliance & Intensity Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <ActiveAppliancesChart />
        <EnergyIntensityChart />
      </div>
    </DashboardShell>
  );
}
