'use client'

import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
  ReferenceLine,
} from 'recharts'
import { TrendingDown, TrendingUp, CheckCircle, Info } from 'lucide-react'

export interface LabDataPoint {
  date: string // e.g. "Apr 2026", "Jul 2026", "Oct 2026"
  value: number
  label?: string
  status?: 'normal' | 'low' | 'high'
}

export interface LabTrendChartProps {
  title: string
  subtitle?: string
  unit: string
  normalRange: {
    min: number
    max: number
    label?: string
  }
  data: LabDataPoint[]
  strokeColor?: string
  yDomain?: [number, number]
  targetDescription?: string
}

export function LabTrendChart({
  title,
  subtitle,
  unit,
  normalRange,
  data,
  strokeColor = '#4A1C40',
  yDomain,
  targetDescription,
}: LabTrendChartProps) {
  const latestPoint = data.length > 0 ? data[data.length - 1] : null
  const previousPoint = data.length > 1 ? data[data.length - 2] : null

  // Determine change
  const valueDelta = latestPoint && previousPoint ? latestPoint.value - previousPoint.value : 0
  const isImproving =
    latestPoint &&
    latestPoint.value >= normalRange.min &&
    latestPoint.value <= normalRange.max

  // Fallback calculated domain
  const values = data.map(d => d.value)
  const computedMin = Math.floor(Math.min(...values, normalRange.min) * 0.8)
  const computedMax = Math.ceil(Math.max(...values, normalRange.max) * 1.2)
  const domain = yDomain || [computedMin, computedMax]

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-4">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-serif text-lg sm:text-xl font-bold text-foreground">
              {title}
            </h4>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-sand-100 text-plum-950 dark:bg-plum-950/80 dark:text-sand-100 border border-sand-200 dark:border-plum-800">
              {unit}
            </span>
          </div>
          {subtitle && (
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>

        {/* Current status pill */}
        {latestPoint && (
          <div className="flex items-center gap-3 bg-muted/30 border border-border/80 px-3.5 py-2 rounded-xl self-start">
            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">
                Latest ({latestPoint.date})
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-2xl font-bold text-plum-950 dark:text-plum-200">
                  {latestPoint.value}
                </span>
                <span className="text-xs text-muted-foreground">{unit}</span>
              </div>
            </div>

            <div className="border-l border-border pl-3">
              {isImproving ? (
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Target Range</span>
                </div>
              ) : latestPoint.value > normalRange.max ? (
                <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 text-xs font-semibold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Elevated</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>Low</span>
                </div>
              )}
              <p className="text-[10px] text-muted-foreground">
                Target: {normalRange.min} – {normalRange.max}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Target explanation helper */}
      {targetDescription && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/20 px-3 py-1.5 rounded-lg border border-border/50">
          <Info className="w-3.5 h-3.5 text-plum-700 dark:text-plum-300 shrink-0" />
          <span>{targetDescription}</span>
        </div>
      )}

      {/* Recharts LineChart */}
      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 12, right: 18, left: -10, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              opacity={0.6}
              vertical={false}
            />

            <XAxis
              dataKey="date"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              dy={6}
            />

            <YAxis
              domain={domain}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickFormatter={(v) => `${v}`}
            />

            {/* Normal Range Reference Band */}
            <ReferenceArea
              y1={normalRange.min}
              y2={normalRange.max}
              fill="#10b981"
              fillOpacity={0.12}
              stroke="#10b981"
              strokeOpacity={0.25}
              strokeDasharray="2 2"
              label={{
                value: normalRange.label || 'Target Range',
                position: 'insideTopRight',
                fill: '#059669',
                fontSize: 10,
                offset: 6,
              }}
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const val = payload[0].value as number
                  return (
                    <div className="bg-popover border border-border rounded-xl p-3 shadow-lg text-xs space-y-1">
                      <p className="font-semibold text-foreground">{label}</p>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-plum-700 dark:bg-plum-300 inline-block" />
                        <span className="text-muted-foreground">Level:</span>
                        <span className="font-bold text-foreground">
                          {val} {unit}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        Normal: {normalRange.min} – {normalRange.max} {unit}
                      </p>
                    </div>
                  )
                }
                return null
              }}
            />

            <Line
              type="monotone"
              dataKey="value"
              stroke={strokeColor}
              strokeWidth={3}
              dot={{
                r: 5,
                fill: strokeColor,
                strokeWidth: 2,
                stroke: 'hsl(var(--background))',
              }}
              activeDot={{
                r: 7,
                fill: '#E8A0A0',
                stroke: strokeColor,
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & Guidance */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/60 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-plum-950 dark:bg-plum-300" />
            Tested Levels
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-2 rounded bg-emerald-500/20 border border-emerald-500/40" />
            Optimal Clinical Range ({normalRange.min} - {normalRange.max} {unit})
          </span>
        </div>
        <span>Consistently reviewed against NABL reference standards</span>
      </div>
    </div>
  )
}
