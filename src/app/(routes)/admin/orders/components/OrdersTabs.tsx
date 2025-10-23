"use client";
import React from "react";
import { TabItem, OrdersTabsProps } from "../types";

export default function OrdersTabs({ tabs, activeKey, onChange }: OrdersTabsProps) {
  return (
    <div className="bg-white shadow sm:rounded-lg">
      <nav className="flex -mb-px" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = tab.key === activeKey;
          return (
            <button
              key={tab.key}
              onClick={() => onChange(tab.key)}
              className={
                "flex-1 min-w-0 py-4 px-6 text-center border-b-2 font-medium text-sm focus:outline-none " +
                (isActive
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300")
              }
            >
              <span className="inline-flex items-center gap-2">
                {tab.label}
                {typeof tab.count === "number" && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    {tab.count}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
