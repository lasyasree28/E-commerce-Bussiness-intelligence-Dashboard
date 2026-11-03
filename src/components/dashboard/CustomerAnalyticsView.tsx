import React from 'react';
import { Customer, CustomerSegmentData, Order } from '../../types';
import { 
  Users, 
  Award, 
  TrendingUp, 
  ShieldCheck, 
  UserCheck, 
  ArrowUpRight, 
  Sparkles,
  MapPin,
  Mail
} from 'lucide-react';

interface CustomerAnalyticsViewProps {
  customers: Customer[];
  segments: CustomerSegmentData[];
  orders: Order[];
}

export const CustomerAnalyticsView: React.FC<CustomerAnalyticsViewProps> = ({
  customers,
  segments,
  orders
}) => {
  // Sort Top 10 by total spend
  const top10Customers = [...customers].sort((a, b) => b.totalSpend - a.totalSpend).slice(0, 10);

  // New vs Returning calculations
  const newCustomers = customers.filter(c => c.segment === 'New Customers' || c.orderCount <= 1);
  const returningCustomers = customers.filter(c => c.orderCount > 1);

  const totalRegistered = customers.length;
  const newCount = newCustomers.length;
  const returningCount = returningCustomers.length;
  const returningPercentage = totalRegistered > 0 ? ((returningCount / totalRegistered) * 100).toFixed(1) : '0';

  // Average customer lifetime value
  const totalSpend = customers.reduce((acc, c) => acc + c.totalSpend, 0);
  const averageClv = totalRegistered > 0 ? (totalSpend / totalRegistered).toFixed(2) : '0.00';

  return (
    <div className="space-y-6">
      {/* Top Customer KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Total Registered Customers</span>
            <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-2">
            {totalRegistered}
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
            Global registered buyer accounts
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Returning Customer Rate</span>
            <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400 mt-2">
            {returningPercentage}%
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
            {returningCount} repeat buyers vs {newCount} first-time
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Average Customer Lifetime Value</span>
            <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-2">
            ${Number(averageClv).toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
            Average cumulative net spend per profile
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>VIP Champions Contribution</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-amber-500 mt-2">
            52.6%
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
            Top tier generates majority of overall gross profit
          </p>
        </div>
      </div>

      {/* Customer Segmentation Breakdown (RFM Cohorts) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              RFM Behavioral Customer Segmentation
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Segmented by Recency, Frequency, and Monetary lifetime value
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">5 Cohorts</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {segments.map(seg => {
            let badgeBg = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300';
            if (seg.segment === 'VIP Champions') badgeBg = 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300';
            if (seg.segment === 'Loyal Customers') badgeBg = 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300';
            if (seg.segment === 'Potential Loyalists') badgeBg = 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300';
            if (seg.segment === 'At-Risk') badgeBg = 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300';
            if (seg.segment === 'New Customers') badgeBg = 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300';

            return (
              <div 
                key={seg.segment}
                className="p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-between"
              >
                <div>
                  <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded ${badgeBg}`}>
                    {seg.segment}
                  </span>
                  <div className="mt-3">
                    <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                      {seg.count}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">
                      customers
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-800 text-[11px]">
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Revenue:</span>
                    <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                      ${seg.totalRevenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500 dark:text-slate-400 mt-1">
                    <span>Avg Spend:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">
                      ${seg.averageSpend.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top 10 Customers Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Top 10 Customers by Lifetime Value (CLV)
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">Ranked by Total Spend</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-slate-50/75 dark:bg-slate-800/40">
                <th className="py-3 px-4"># Rank</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Member Since</th>
                <th className="py-3 px-4">Segment</th>
                <th className="py-3 px-4 text-center">Orders</th>
                <th className="py-3 px-4 text-right">Avg Order Value</th>
                <th className="py-3 px-4 text-right">Total Lifetime Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-700 dark:text-slate-300">
              {top10Customers.map((cust, idx) => {
                const aov = cust.orderCount > 0 ? cust.totalSpend / cust.orderCount : 0;

                return (
                  <tr key={cust.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-400">
                      #{idx + 1}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center shrink-0">
                          {cust.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {cust.name}
                          </div>
                          <div className="text-[11px] text-slate-400 dark:text-slate-500">
                            {cust.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{cust.city}, {cust.country}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500 dark:text-slate-400">
                      {cust.registrationDate}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block text-[11px] font-medium text-slate-700 dark:text-slate-300">
                        {cust.segment}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-center font-semibold text-slate-800 dark:text-slate-200">
                      {cust.orderCount}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-right text-slate-600 dark:text-slate-300">
                      ${aov.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-right font-bold text-blue-600 dark:text-blue-400 text-sm">
                      ${cust.totalSpend.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
