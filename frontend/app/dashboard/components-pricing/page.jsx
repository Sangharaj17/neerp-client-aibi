"use client";

import React from "react";
import Link from "next/link";
import {
  Package,
  Settings,
  Fan,
  Box,
  Layers,
  Zap,
  Grid,
  Anchor,
  ArrowUpCircle,
  Cpu,
  Database,
  Disc,
  LifeBuoy,
  Minimize2,
  Maximize2,
  AlignJustify,
  Divide,
  Activity,
  BoxSelect,
  CloudLightning,
  Component,
} from "lucide-react";
import PageHeader from "@/components/UI/PageHeader";

// Map slugs to Icons
const iconMap = {
  "capacity-unit": Database,
  "basic-setup": Settings,
  "operator-elevators": ArrowUpCircle,
  "landing-door-type": Minimize2,
  "car-door-type": Maximize2,
  "cabin-type": Box,
  "cabin-flooring": Grid,
  "cabin-false-ceiling": Layers,
  "air-system-type": Fan,
  "control-panel-type": Cpu,
  "machine-room-type": CloudLightning,
  "type-of-lift": Activity,
  "light-fittings": Zap,
  "wiring-pluggable-harness": CloudLightning,
  "add-ard-type": Activity,
  "car-counter-bracket": AlignJustify,
  "governer-safety-rope": Anchor,
  "lop-type": BoxSelect,
  "other-material": Component,
  "cop-type": BoxSelect,
  "frame-type": Maximize2,
  "wire-rope": Disc,
  "guide-rail": AlignJustify,
  "counter-weight": Database,
  fastener: Settings,
};

const componentsPricing = [
  { title: "Capacity N Unit", slug: "capacity-unit" },
  { title: "Basic Setup", slug: "basic-setup" },
  { title: "Elevator Operation", slug: "operator-elevators" },
  { title: "Landing Door Type", slug: "landing-door-type" },
  { title: "Car Door Type", slug: "car-door-type" },
  { title: "Cabin Type", slug: "cabin-type" },
  { title: "Cabin Flooring", slug: "cabin-flooring" },
  { title: "Cabin False Ceiling", slug: "cabin-false-ceiling" },
  { title: "Air System Type", slug: "air-system-type" },
  { title: "Control Panel Type", slug: "control-panel-type" },
  { title: "Machine Room Type", slug: "machine-room-type" },
  { title: "Type Of Lift", slug: "type-of-lift" },
  { title: "Light Fittings", slug: "light-fittings" },
  { title: "Wiring Pluggable Harness", slug: "wiring-pluggable-harness" },
  { title: "ARD Type", slug: "add-ard-type" },
  { title: "Car Bracket & Counter Brace", slug: "car-counter-bracket" },
  { title: "Governer Safety Rope", slug: "governer-safety-rope" },
  { title: "LOP Type", slug: "lop-type" },
  { title: "Other material", slug: "other-material" },
  { title: "Cop Type", slug: "cop-type" },
  { title: "Counter Frame Type", slug: "frame-type" },
  { title: "Wire rope", slug: "wire-rope" },
  { title: "Guide Rail", slug: "guide-rail" },
  { title: "Counter Weight", slug: "counter-weight" },
  { title: "Fastener", slug: "fastener" },
];

export default function ComponentsPricingOverview() {
  return (
    <div className="space-y-8 w-full p-6 min-h-screen bg-slate-50">
      <PageHeader
        title="Components & Pricing"
        description="Manage all elevator components and their pricing configurations."
        icon={Package}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {componentsPricing.map((item, index) => {
          const Icon = iconMap[item.slug] || Box;

          // Generate a deterministic color index based on the title length
          // This ensures consistent colors for items without hardcoding
          const colorSchemes = [
            {
              bg: "bg-indigo-50",
              text: "text-indigo-600",
              border: "hover:border-indigo-200",
              groupHoverBg: "group-hover:bg-indigo-100",
              groupHoverText: "group-hover:text-indigo-700",
            },
            {
              bg: "bg-emerald-50",
              text: "text-emerald-600",
              border: "hover:border-emerald-200",
              groupHoverBg: "group-hover:bg-emerald-100",
              groupHoverText: "group-hover:text-emerald-700",
            },
            {
              bg: "bg-sky-50",
              text: "text-sky-600",
              border: "hover:border-sky-200",
              groupHoverBg: "group-hover:bg-sky-100",
              groupHoverText: "group-hover:text-sky-700",
            },
            {
              bg: "bg-violet-50",
              text: "text-violet-600",
              border: "hover:border-violet-200",
              groupHoverBg: "group-hover:bg-violet-100",
              groupHoverText: "group-hover:text-violet-700",
            },
            {
              bg: "bg-amber-50",
              text: "text-amber-600",
              border: "hover:border-amber-200",
              groupHoverBg: "group-hover:bg-amber-100",
              groupHoverText: "group-hover:text-amber-700",
            },
            {
              bg: "bg-rose-50",
              text: "text-rose-600",
              border: "hover:border-rose-200",
              groupHoverBg: "group-hover:bg-rose-100",
              groupHoverText: "group-hover:text-rose-700",
            },
          ];

          const color = colorSchemes[item.title.length % colorSchemes.length];

          return (
            <Link
              key={index}
              href={`/dashboard/components-pricing/${item.slug}`}
              className="block group h-full"
            >
              <div
                className={`bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 ${color.border} h-full flex flex-col relative group-hover:-translate-y-1`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`p-2.5 rounded-lg transition-colors duration-300 ${color.bg} ${color.text} ${color.groupHoverBg} ${color.groupHoverText}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3
                    className={`text-base font-semibold text-slate-700 transition-colors duration-300 ${color.groupHoverText}`}
                  >
                    {item.title}
                  </h3>
                </div>
                <p className="text-sm text-slate-500 mb-4 leading-relaxed">
                  Manage {item.title.toLowerCase()} settings and pricing.
                </p>
                <div className="mt-auto flex justify-end items-end w-full">
                  {/* <div className="h-1 w-12 rounded-full bg-slate-100 group-hover:bg-slate-200 transition-colors"></div> */}
                  <span
                    className={`text-xs font-medium transition-colors duration-300 ${color.text} ${color.groupHoverText}`}
                  >
                    Navigate →
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
