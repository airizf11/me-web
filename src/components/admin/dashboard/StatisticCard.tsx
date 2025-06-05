// src/components/admin/dashboard/StatisticCard.tsx
import React from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline"; // Ikon error

type StatisticCardProps = {
  title: string;
  value: string;
  description?: string;
  icon: React.ElementType; // Icon component dari Heroicons
  error?: string | null;
};

export function StatisticCard({
  title,
  value,
  description,
  icon: Icon,
  error,
}: StatisticCardProps) {
  return (
    <div className="bg-warm-brown text-light-cream p-6 rounded-lg shadow-md flex items-center space-x-4">
      <div className="shrink-0">
        {error ? (
          <ExclamationCircleIcon className="h-10 w-10 text-red-300" />
        ) : (
          <Icon className="h-10 w-10 text-clay-pink" />
        )}
      </div>
      <div>
        <h3 className="text-sm font-body uppercase tracking-wider opacity-80">
          {title}
        </h3>
        {error ? (
          <p className="text-red-300 font-body text-sm mt-1">{error}</p>
        ) : (
          <>
            <p className="text-3xl font-bold font-display leading-none">
              {value}
            </p>
            {description && (
              <p className="text-xs font-body opacity-70 mt-1">{description}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
