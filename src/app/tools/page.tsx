"use client";
import React, { useState } from "react";
import { Input } from "@/components/input";
import { Button } from "@/components/button";

export default function ToolsClient() {
  const [result, setResult] = useState<{
    D: number;
    batches: number;
    additionalBatches: number;
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
    const A = Number((form.elements.namedItem("A") as HTMLInputElement).value);
    const B = Number((form.elements.namedItem("B") as HTMLInputElement).value);
    const C = Number((form.elements.namedItem("C") as HTMLInputElement).value);
    const E = Number((form.elements.namedItem("E") as HTMLInputElement).value);
    const F = Number((form.elements.namedItem("F") as HTMLInputElement).value);
    const G = Number((form.elements.namedItem("G") as HTMLInputElement).value);

    if (E <= 0 || F <= 0 || G <= 0) {
      setResult(null);
      return;
    }

    const batches = Math.min(
      Math.floor(A / E),
      Math.floor(B / F),
      Math.floor(C / G)
    );

    const D_initial = batches * 10;
    const A_consumed = batches * E;
    const B_consumed = batches * F;
    const C_consumed = batches * G;

    let A_left = A - A_consumed;
    let B_left = B - B_consumed;
    let C_left = C - C_consumed;

    const max_batches_possible = Math.min(
      Math.floor(A_left / E),
      Math.floor(B_left / F)
    );
    const required_C = max_batches_possible * G;

    const Z_from_A = Math.floor((A_left / 100) * 80);
    const Z_from_B = Math.floor((B_left / 50) * 80);
    const total_Z = Z_from_A + Z_from_B;

    const C_producible_from_Z = Math.floor(total_Z / 100) * 10;
    const C_produced = Math.min(C_producible_from_Z, required_C - C_left);

    const Z_needed = Math.ceil(C_produced / 10) * 100;
    const A_converted = Z_needed > 0 ? Math.min(A_left, Math.floor(Z_needed / 2)) : 0;
    const B_converted = Z_needed > 0 ? Math.min(B_left, Math.floor(Z_needed / 2.5)) : 0;

    A_left -= A_converted;
    B_left -= B_converted;
    C_left += C_produced;

    const additionalBatches = Math.min(
      Math.floor(A_left / E),
      Math.floor(B_left / F),
      Math.floor(C_left / G)
    );

    const A_additional_consumed = additionalBatches * E;
    const B_additional_consumed = additionalBatches * F;
    const C_additional_consumed = additionalBatches * G;

    A_left -= A_additional_consumed;
    B_left -= B_additional_consumed;
    C_left -= C_additional_consumed;

    const D = D_initial + additionalBatches;

    setResult({
      D,
      batches,
      additionalBatches,
      A_left,
      B_left,
      C_left,
      A_converted,
      B_converted,
      E,
      F,
      G,
    });
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
              <b>Initial batches made:</b> {result.batches}
            </div>
            <div>
              <b>Additional batches made from conversion:</b>{" "}
              {result.additionalBatches}
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
