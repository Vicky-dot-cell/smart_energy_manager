'use client';

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

export default function Home() {
  return (
    <DashboardShell>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Current Voltage"
          value="230.5 V"
          icon={Zap}
          trend="+1.2%"
          trendUp={true}
        />
        <StatCard
          title="Current Load"
          value="4.2 A"
          icon={Activity}
          trend="-0.5%"
          trendUp={false}
        />
        <StatCard
          title="Power Usage"
          value="950 W"
          icon={Battery}
          trend="+5.4%"
          trendUp={true}
        />
        <StatCard
          title="Total Energy"
          value="142.5 kWh"
          icon={TrendingUp}
          trend="+2.1%"
          trendUp={true}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-2">
          <EnergyChart />
        </div>

        {/* Activity Feed */}
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
