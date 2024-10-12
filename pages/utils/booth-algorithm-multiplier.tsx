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

  const boothAlgorithm = (MInput: number, QInput: number) => {
    const n = 4; // 비트 수 설정
    const maxNum = (1 << (n - 1)) - 1;
    const minNum = - (1 << (n - 1));

    if (MInput < minNum || MInput > maxNum || QInput < minNum || QInput > maxNum) {
      alert(`입력 값은 ${minNum}부터 ${maxNum} 사이의 정수여야 합니다.`);
      return;
    }

    let A = 0;
    let q0 = 0;
    const M_nbits = n + 1; // A와 M은 n+1 비트를 사용합니다.
    const total_bits = n + n + 1; // A(n+1비트) + Q(n비트) + q0(1비트)

    const twosComplement = (value: number, bits: number) => {
      if (value >= 0) {
        return value;
      } else {
        return (1 << bits) + value;
      }
    };

    const getBin = (value: number, bits: number) => {
      const valueTc = twosComplement(value, bits);
      return valueTc.toString(2).padStart(bits, '0');
    };

    const stepsArray: Step[] = [];

    // M과 -M의 2의 보수 표현
    const M_comp = twosComplement(MInput, M_nbits);
    const minus_M_comp = twosComplement(-MInput, M_nbits);

    // Q의 2의 보수 표현
    let Q_comp = twosComplement(QInput, n);

    for (let step = 0; step < n; step++) {
      const q1 = Q_comp & 1; // Q의 현재 LSB
      let operation = '';

      // q1과 q0에 따른 연산 결정
      if (q1 === 0 && q0 === 1) {
        // A = A + M
        A += MInput;
        operation = 'A = A + M';
      } else if (q1 === 1 && q0 === 0) {
        // A = A - M
        A -= MInput;
        operation = 'A = A - M';
      }

      // A를 n+1 비트로 제한
      A = A & ((1 << M_nbits) - 1);
      if (A & (1 << (M_nbits - 1))) {
        A = A - (1 << M_nbits); // 음수 조정
      }

      // [A | Q_comp | q0]의 산술적 오른쪽 시프트
      let combined = (A << (n + 1)) | (Q_comp << 1) | q0;
      combined &= (1 << total_bits) - 1; // 비트 길이 조정

      // 산술적 오른쪽 시프트 수행
      const msb = (combined >> (total_bits - 1)) & 1; // MSB 가져오기
      let combinedShifted = combined >> 1;
      if (msb) {
        combinedShifted |= (1 << (total_bits - 1)); // 부호 비트 유지
      } else {
        combinedShifted &= ~ (1 << (total_bits - 1)); // 부호 비트 유지
      }

      // 새로운 A, Q_comp, q0 추출
      q0 = combinedShifted & 1;
      Q_comp = (combinedShifted >> 1) & ((1 << n) - 1);
      A = (combinedShifted >> (n + 1));
      const A_bits = A & ((1 << M_nbits) - 1);
      if (A_bits & (1 << (M_nbits - 1))) {
        A = A_bits - (1 << M_nbits);
      } else {
        A = A_bits;
      }

      // 단계 저장
      stepsArray.push({
        step: step + 1,
        operation,
        n: n - step - 1,
        A: getBin(A, M_nbits),
        Q: getBin(Q_comp, n),
        q0,
      });
    }

    // 최종 곱 계산
    let finalProduct = (A << n) | Q_comp;
    if (finalProduct & (1 << (2 * n - 1))) {
      finalProduct -= (1 << (2 * n));
    }

    setSteps(stepsArray);
    setProduct(finalProduct);
  };

  const handleCalculate = () => {
    setSteps([]);
    setProduct(null);
    boothAlgorithm(M, Q);
  };

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