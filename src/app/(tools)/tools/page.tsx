'use client';
import React, { useState } from 'react';
import { Input } from '@/components/input';
import { Button } from '@/components/button';

function optimizeProduction(
  A: number,
  B: number,
  C: number,
  E: number,
  F: number,
  G: number
): {
  D: number;
  A_left: number;
  B_left: number;
  C_left: number;
  A_converted: number;
  B_converted: number;
} {
  // Strategy 1: No conversion (baseline)
  const strategy1Batches = Math.min(
    Math.floor(A / E),
    Math.floor(B / F),
    Math.floor(C / G)
  );
  const strategy1D = strategy1Batches * 10;
  const strategy1ALeft = A - strategy1Batches * E;
  const strategy1BLeft = B - strategy1Batches * F;
  const strategy1CLeft = C - strategy1Batches * G;

  // Initialize best solution with the baseline
  let bestD = strategy1D;
  let bestAConverted = 0;
  let bestBConverted = 0;
  let bestALeft = strategy1ALeft;
  let bestBLeft = strategy1BLeft;
  let bestCLeft = strategy1CLeft;

  // Try different conversion percentages of A and B
  for (let aPercent = 0; aPercent <= 100; aPercent += 5) {
    for (let bPercent = 0; bPercent <= 100; bPercent += 5) {
      // Calculate how much A and B to convert
      const aToConvert =
        Math.floor(Math.floor((A * aPercent) / 100) / 100) * 100; // Round down to multiple of 100
      const bToConvert = Math.floor(Math.floor((B * bPercent) / 100) / 50) * 50; // Round down to multiple of 50

      // Calculate Z and C produced
      const zProduced =
        Math.floor(aToConvert / 100) * 80 + Math.floor(bToConvert / 50) * 80;
      const cProduced = Math.floor(zProduced / 100) * 10;

      // Calculate remaining resources
      const aRemain = A - aToConvert;
      const bRemain = B - bToConvert;
      const cRemain = C + cProduced;

      // Calculate max batches with remaining resources
      const batches = Math.min(
        E > 0 ? Math.floor(aRemain / E) : Number.POSITIVE_INFINITY,
        F > 0 ? Math.floor(bRemain / F) : Number.POSITIVE_INFINITY,
        G > 0 ? Math.floor(cRemain / G) : Number.POSITIVE_INFINITY
      );

      // Calculate D produced
      const dProduced = batches * 10;

      // Update best if this is better
      if (dProduced > bestD) {
        bestD = dProduced;
        bestAConverted = aToConvert;
        bestBConverted = bToConvert;
        bestALeft = aRemain - batches * E;
        bestBLeft = bRemain - batches * F;
        bestCLeft = cRemain - batches * G;
      }
    }
  }

  // Return the best solution found
  return {
    D: bestD,
    A_left: bestALeft,
    B_left: bestBLeft,
    C_left: bestCLeft,
    A_converted: bestAConverted,
    B_converted: bestBConverted,
  };
}

export default function ToolsClient() {
  const [result, setResult] = useState<{
    D: number;
    A_left: number;
    B_left: number;
    C_left: number;
    A_converted: number;
    B_converted: number;
    E: number;
    F: number;
    G: number;
  } | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const A = Number((form.elements.namedItem('A') as HTMLInputElement).value);
    const B = Number((form.elements.namedItem('B') as HTMLInputElement).value);
    const C = Number((form.elements.namedItem('C') as HTMLInputElement).value);
    const E = Number((form.elements.namedItem('E') as HTMLInputElement).value);
    const F = Number((form.elements.namedItem('F') as HTMLInputElement).value);
    const G = Number((form.elements.namedItem('G') as HTMLInputElement).value);
    const { D, A_left, B_left, C_left, A_converted, B_converted } = optimizeProduction(A, B, C, E, F, G);
    setResult({ D, A_left, B_left, C_left, A_converted, B_converted, E, F, G });
  }

  return (
    <main className="max-w-xl mx-auto font-sans mt-8">
      <h1 className="text-2xl font-bold mb-6">
        Crafting Material Conversion Calculator
      </h1>
      <form
        id="form"
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 mb-6"
      >
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Left column: resource inputs */}
          <div className="flex-1 flex flex-col gap-4">
            <label className="flex flex-col gap-1">
              White:
              <Input name="A" type="number" min={0} required defaultValue={0} />
            </label>
            <label className="flex flex-col gap-1">
              Green:
              <Input name="B" type="number" min={0} required defaultValue={0} />
            </label>
            <label className="flex flex-col gap-1">
              Blue:
              <Input name="C" type="number" min={0} required defaultValue={0} />
            </label>
          </div>
          {/* Right column: ratio inputs */}
          <div className="flex-1 flex flex-col gap-4">
            <label className="flex flex-col gap-1">
              White per batch:
              <Input
                name="E"
                type="number"
                min={1}
                required
                defaultValue={100}
              />
            </label>
            <label className="flex flex-col gap-1">
              Green per batch:
              <Input
                name="F"
                type="number"
                min={1}
                required
                defaultValue={50}
              />
            </label>
            <label className="flex flex-col gap-1">
              Blue per batch:
              <Input
                name="G"
                type="number"
                min={1}
                required
                defaultValue={10}
              />
            </label>
          </div>
        </div>
        <Button
          type="submit"
          form="form"
          onClick={(e) => {
            e.currentTarget.blur();
          }}
        >
          Calculate
        </Button>
      </form>
      {result && (
        <div className="p-4 border border-gray-300 rounded">
          <h2 className="text-lg font-semibold mb-2">Results</h2>
          <div className="space-y-1">
            <div>
              <b>Total final batches made:</b> {result.D}
            </div>
            <div>
              <b>White converted:</b> {result.A_converted}
            </div>
            <div>
              <b>Green converted:</b> {result.B_converted}
            </div>
            <div>
              <b>Leftover White:</b> {result.A_left}
            </div>
            <div>
              <b>Leftover Green:</b> {result.B_left}
            </div>
            <div>
              <b>Leftover Blue:</b> {result.C_left}
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Using ratio: {result.E} White, {result.F} Green, {result.G} Blue per
            batch (10 Final per batch)
          </div>
        </div>
      )}
    </main>
  );
}
