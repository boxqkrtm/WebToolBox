import React, { useState } from 'react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table } from "@/components/ui/table"

interface Step {
  step: number;
  operation: string;
  n: number;
  A: string;
  Q: string;
  q0: number;
}

const BoothMultiplier: React.FC = () => {
  const [M, setM] = useState<number>(0);
  const [Q, setQ] = useState<number>(0);
  const [steps, setSteps] = useState<Step[]>([]);
  const [product, setProduct] = useState<number | null>(null);

  // ... (기존의 boothAlgorithm 함수와 다른 로직은 그대로 유지)

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Booth 알고리즘 곱셈기</h1>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block mb-2">Multiplicand M (-8 ~ 7):</label>
          <Input
            type="number"
            value={M}
            onChange={(e) => setM(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="block mb-2">Multiplier Q (-8 ~ 7):</label>
          <Input
            type="number"
            value={Q}
            onChange={(e) => setQ(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
      
      <Button onClick={handleCalculate} className="w-full mb-6">계산하기</Button>
      
      {steps.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">과정</h2>
          <div className="overflow-x-auto">
            <Table>
              <thead>
                <tr>
                  <th className="px-4 py-2">단계</th>
                  <th className="px-4 py-2">연산</th>
                  <th className="px-4 py-2">n</th>
                  <th className="px-4 py-2">A</th>
                  <th className="px-4 py-2">Q</th>
                  <th className="px-4 py-2">q₀</th>
                </tr>
              </thead>
              <tbody>
                {steps.map((step) => (
                  <tr key={step.step}>
                    <td className="border px-4 py-2">{step.step}</td>
                    <td className="border px-4 py-2">{step.operation}</td>
                    <td className="border px-4 py-2">{step.n}</td>
                    <td className="border px-4 py-2 font-mono">{step.A}</td>
                    <td className="border px-4 py-2 font-mono">{step.Q}</td>
                    <td className="border px-4 py-2">{step.q0}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <h2 className="text-2xl font-semibold mt-6 mb-2">결과</h2>
          <p className="text-xl">최종 곱: <span className="font-bold">{product}</span></p>
        </div>
      )}
    </div>
  );
};

export default BoothMultiplier;