import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// GGUF bits-per-weight mapping (파라미터당 비트 수)
const ggufQuants: { [key: string]: number } = {
  // https://github.com/ggerganov/llama.cpp/blob/master/ggml.c#L1769
  IQ1_S: 1.56, // Approximate
  IQ2_XXS: 2.06,
  IQ2_XS: 2.31,
  IQ2_S: 2.5,
  IQ2_M: 2.7,
  IQ3_XXS: 3.06,
  IQ3_XS: 3.3,
  Q2_K: 3.35,
  Q3_K_S: 3.5,
  IQ3_S: 3.5,
  IQ3_M: 3.7,
  Q3_K_M: 3.91,
  Q3_K_L: 4.27,
  IQ4_XS: 4.25,
  IQ4_NL: 4.5,
  Q4_0: 4.55,
  Q4_K_S: 4.58,
  Q4_K_M: 4.85,
  Q5_0: 5.54,
  Q5_K_S: 5.54,
  Q5_K_M: 5.69,
  Q6_K: 6.59,
  Q8_0: 8.5,
  F16: 16,
  F32: 32
};

// KV Cache bits-per-element mapping (각 K 또는 V 요소당 비트 수)
const kvCacheQuants: { [key: string]: number } = {
  "F16": 16,     // 16비트 (2 bytes)
  "Q8": 8,       // 8비트 (1 byte)
  "Q4": 4        // 4비트 (0.5 bytes)
};

const contextOptions = [
  { value: "512", label: "0.5k" },
  { value: "1024", label: "1k" },
  { value: "2048", label: "2k" },
  { value: "4096", label: "4k" },
  { value: "8192", label: "8k" },
  { value: "16384", label: "16k" },
  { value: "32768", label: "32k" },
  { value: "65536", label: "64k" },
  { value: "131072", label: "128k" },
];

// --- 내부적으로 가정하는 모델 구조 상수 (UI에서는 숨김) ---
// 이 값들은 특정 0.6B 모델의 구조를 가정한 것입니다.
// 실제 모델과 다를 수 있습니다.
const ASSUMED_NUM_LAYERS = 24; // 가정된 레이어 수
const ASSUMED_HEAD_DIM = 96;     // 가정된 헤드 차원 (d_head)
const ASSUMED_GQA_Q = 16;        // 가정된 Q 헤드 수
const ASSUMED_GQA_KV = 8;        // 가정된 KV 헤드 수
// ----------------------------------------------------------

export default function LlmVramCalculator() {
  // 초기값을 0.6B 모델, 32k 컨텍스트, Q4_K_M, F16 KV에 맞춤
  const [modelSize, setModelSize] = useState<number>(0.6); // billion
  const [contextLength, setContextLength] = useState<string>("32768"); // tokens
  const [quantKey, setQuantKey] = useState<string>('Q4_K_M');
  const [kvQuantKey, setKvQuantKey] = useState<string>('F16');
  // llama.cpp 3.7GB 결과에 맞추기 위해 오버헤드를 0.5GB~1GB 사이로 조정
  const [overheadGB, setOverheadGB] = useState<number>(1.3); // 조정된 기본 오버헤드 추정치

  const [modelMemGB, setModelMemGB] = useState<number>(0);
  const [contextMemGB, setContextMemGB] = useState<number>(0);
  const [totalMemGB, setTotalMemGB] = useState<number>(0);

  useEffect(() => {
    calculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelSize, contextLength, quantKey, kvQuantKey, overheadGB]); // 의존성 배열

  const calculate = () => {
    const sizeB = modelSize;
    const bpw = ggufQuants[quantKey]; // bits per weight
    const kvBits = kvCacheQuants[kvQuantKey]; // bits per KV element
    const context = parseInt(contextLength); // tokens
    const extraOverhead = overheadGB; // GB

    // 입력 유효성 검사
    if (isNaN(sizeB) || sizeB < 0 ||
        isNaN(bpw) || bpw <= 0 ||
        isNaN(context) || context < 1 ||
        isNaN(kvBits) || kvBits <= 0 ||
        isNaN(extraOverhead) || extraOverhead < 0
       )
    {
        setModelMemGB(NaN);
        setContextMemGB(NaN);
        setTotalMemGB(NaN);
        return;
    }

    // 1. 모델 가중치 메모리
    // (모델 파라미터 수) * (파라미터당 비트 수) / 8 bits/byte
    const modelBytes = sizeB * 1e9 * bpw / 8;
    const calculatedModelGB = modelBytes / (1024 ** 3);

    // 2. KV 캐시 메모리 (가정된 구조 사용)
    // (컨텍스트 길이) * (가정된 레이어 수) * 2 (K, V) * (가정된 KV 헤드 수) * (가정된 헤드 차원) * (KV 데이터 정밀도 바이트)
    const kvBytesPerTokenPerLayer = 2 * ASSUMED_GQA_KV * ASSUMED_HEAD_DIM * (kvBits / 8);
    const totalKvBytes = context * ASSUMED_NUM_LAYERS * kvBytesPerTokenPerLayer;
    const calculatedCtxGB = totalKvBytes / (1024 ** 3);

    // 3. 총 VRAM (모델 가중치 + KV 캐시 + 오버헤드)
    const total = calculatedModelGB + calculatedCtxGB + extraOverhead;

    setModelMemGB(calculatedModelGB);
    setContextMemGB(calculatedCtxGB);
    setTotalMemGB(total);
  };

  // 일반 숫자 입력 핸들러
  const handleNumberChange = (setter: React.Dispatch<React.SetStateAction<number>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setter(isNaN(value) && e.target.value !== '' ? NaN : value);
  };

   const handleNumberBlur = (stateValue: number, setter: React.Dispatch<React.SetStateAction<number>>, defaultValue: number = 0, minValue: number = 0) => (e: React.FocusEvent<HTMLInputElement>) => {
     const value = parseFloat(e.target.value);
    if (e.target.value === '' || isNaN(value) || value < minValue) {
        setter(defaultValue);
    } else {
         setter(value);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>LLM VRAM Calculator (GGUF Estimate)</CardTitle>
        <CardDescription>Estimate VRAM usage based on assumed model structure and quantization.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="modelSize">Model Size (billion parameters)</Label>
          <Input
            id="modelSize"
            type="number"
            min="0"
            step="0.1"
            value={isNaN(modelSize) ? '' : modelSize}
            onChange={handleNumberChange(setModelSize)}
            onBlur={handleNumberBlur(modelSize, setModelSize, 0, 0)}
            placeholder="e.g., 7"
          />
           <p className="text-sm text-muted-foreground">주로 가중치 메모리 계산에 사용됩니다.</p>
        </div>

        {/* 모델 구조 상세 입력 필드는 제거됨 */}
        {/* <div className="grid grid-cols-2 gap-4">...</div> */}
        <p className="text-sm text-muted-foreground">
            (Note: This calculator assumes a specific internal model structure, like ~{ASSUMED_NUM_LAYERS} layers, ~{ASSUMED_GQA_Q}/{ASSUMED_GQA_KV} Attention Heads, and ~{ASSUMED_HEAD_DIM} head dimension, based on typical small models. Actual structure may vary.)
        </p>

        <div className="space-y-2">
          <Label>Context Length (Tokens)</Label>
          <RadioGroup value={contextLength} onValueChange={setContextLength} className="grid grid-cols-3 gap-2">
            {contextOptions.map(option => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`context-${option.value}`} />
                <Label htmlFor={`context-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantSize">GGUF Weight Quantization</Label>
          <Select value={quantKey} onValueChange={setQuantKey}>
            <SelectTrigger id="quantSize">
              <SelectValue placeholder="Select quantization" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(ggufQuants).map(key => (
                <SelectItem key={key} value={key}>{key}</SelectItem>
              ))}
            </SelectContent>
          </Select>
           <p className="text-sm text-muted-foreground">모델 가중치의 정밀도 (bits per weight).</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="kvQuantSize">KV Cache Quantization</Label>
          <Select value={kvQuantKey} onValueChange={setKvQuantKey}>
            <SelectTrigger id="kvQuantSize">
              <SelectValue placeholder="Select KV cache quantization" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(kvCacheQuants).map(([key, value]) => (
                <SelectItem key={key} value={key}>{key} ({value}-bit)</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">K/V 캐시 요소의 정밀도. F16이 기본값입니다.</p>
        </div>

        <div className="space-y-2">
            <Label htmlFor="overheadGB">Additional Overhead (GB)</Label>
            <Input
                id="overheadGB"
                type="number"
                min="0"
                step="0.1"
                value={isNaN(overheadGB) ? '' : overheadGB}
                 onChange={handleNumberChange(setOverheadGB)}
                onBlur={handleNumberBlur(overheadGB, setOverheadGB, 0.5, 0)}
                placeholder="e.g., 0.5"
            />
             <p className="text-sm text-muted-foreground">활성화, 버퍼, 프레임워크 오버헤드 등. llama.cpp/ollama 환경에 따라 조절해 보세요.</p>
        </div>

        <Card className="bg-muted/50">
             <CardHeader className="p-4">
                 <CardTitle className="text-lg">Estimated VRAM Breakdown</CardTitle>
             </CardHeader>
             <CardContent className="p-4 space-y-2">
                <p>Model Weights: <span className="font-semibold">{isFinite(modelMemGB) ? modelMemGB.toFixed(2) : 'N/A'}</span> GB</p>
                <p>KV Cache: <span className="font-semibold">{isFinite(contextMemGB) ? contextMemGB.toFixed(2) : 'N/A'}</span> GB</p>
                <p>Overhead: <span className="font-semibold">{isFinite(overheadGB) ? overheadGB.toFixed(2) : 'N/A'}</span> GB</p>
                <p className="text-lg"><strong>Total Estimated VRAM: <span className="font-semibold">{isFinite(totalMemGB) ? totalMemGB.toFixed(2) : 'N/A'}</span> GB</strong></p>
             </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}