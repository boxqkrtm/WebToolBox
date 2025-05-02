import React, { useState, useEffect } from 'react'; // Import React
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// GGUF bits-per-weight mapping
const ggufQuants: { [key: string]: number } = {
  IQ1_S: 1.56,
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
  Q8_0: 8.5
};

// KV Cache bits-per-element mapping
const kvCacheQuants: { [key: string]: number } = {
  "F16": 16,     // 기본 FP16 포맷, 16비트
  "Q8": 8,       // 8비트 양자화
  "Q4": 4        // 4비트 양자화
};

const contextOptions = [
  { value: "4096", label: "4k" },
  { value: "8192", label: "8k" },
  { value: "16384", label: "16k" },
  { value: "32768", label: "32k" },
  { value: "65536", label: "64k" },
  { value: "131072", label: "128k" },
];

export default function LlmVramCalculator() {
  const [modelSize, setModelSize] = useState<number>(7);
  const [gqaQ, setGqaQ] = useState<number>(1);
  const [gqaKV, setGqaKV] = useState<number>(1);
  const [contextLength, setContextLength] = useState<string>("4096");
  const [quantKey, setQuantKey] = useState<string>('Q4_K_M');
  const [kvQuantKey, setKvQuantKey] = useState<string>('F16');

  const [modelMemGB, setModelMemGB] = useState<number>(0);
  const [contextMemGB, setContextMemGB] = useState<number>(0);
  const [totalMemGB, setTotalMemGB] = useState<number>(0);

  useEffect(() => {
    calculate();
  }, [modelSize, gqaQ, gqaKV, contextLength, quantKey, kvQuantKey]);

  const calculate = () => {
    const sizeB = modelSize;
    const n = gqaQ > 0 ? gqaQ : 1; // Ensure n is not zero
    const m = gqaKV > 0 ? gqaKV : 1; // Ensure m is not zero
    const bpw = ggufQuants[quantKey];
    const kvBits = kvCacheQuants[kvQuantKey];
    const context = parseInt(contextLength);

    if (isNaN(sizeB) || isNaN(n) || isNaN(m) || isNaN(bpw) || isNaN(context)) {
        setModelMemGB(0);
        setContextMemGB(0);
        setTotalMemGB(0);
        return;
    }

    // Model memory in bytes
    const modelBytes = sizeB * 1e9 * bpw / 8;
    const calculatedModelGB = modelBytes / (1024 ** 3);

    // Context memory: scaled by KV/Q ratio and KV quantization
    const baseCtx = 4096; // Reference context size for scaling
    const kvFactor = kvBits / 16; // Normalize against the default F16 (16-bit)
    
    // Ensure calculatedModelGB is a valid number before using it
    const calculatedCtxGB = isFinite(calculatedModelGB) ? calculatedModelGB * (context / baseCtx) * (m / n) * kvFactor : 0;

    setModelMemGB(calculatedModelGB);
    setContextMemGB(calculatedCtxGB);
    setTotalMemGB(calculatedModelGB + calculatedCtxGB);
  };

  const handleNumberChange = (setter: React.Dispatch<React.SetStateAction<number>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setter(isNaN(value) ? 0 : value); // Set to 0 if input is not a valid number
  };

  const handleGqaChange = (setter: React.Dispatch<React.SetStateAction<number>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
     // Allow empty input temporarily, default to 1 if blurred empty, prevent 0 or negative
    if (e.target.value === '') {
        setter(NaN); // Use NaN to represent empty state internally
    } else if (!isNaN(value) && value >= 1) {
        setter(value);
    }
  };

   const handleGqaBlur = (stateValue: number, setter: React.Dispatch<React.SetStateAction<number>>) => (e: React.FocusEvent<HTMLInputElement>) => {
    if (isNaN(stateValue) || stateValue < 1) {
        setter(1); // Default to 1 if empty or invalid on blur
    }
  };


  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>LLM VRAM Calculator (GGUF Only)</CardTitle>
        <CardDescription>Estimate VRAM usage for GGUF models.</CardDescription>
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
            placeholder="e.g., 7"
          />
        </div>

        <div className="space-y-2">
          <Label>GQA Groups</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="gqaQ">Q group (n)</Label>
              <Input
                id="gqaQ"
                type="number"
                min="1"
                step="1"
                value={isNaN(gqaQ) ? '' : gqaQ}
                onChange={handleGqaChange(setGqaQ)}
                onBlur={handleGqaBlur(gqaQ, setGqaQ)}
                placeholder="1"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="gqaKV">KV group (m)</Label>
              <Input
                id="gqaKV"
                type="number"
                min="1"
                step="1"
                 value={isNaN(gqaKV) ? '' : gqaKV}
                onChange={handleGqaChange(setGqaKV)}
                onBlur={handleGqaBlur(gqaKV, setGqaKV)}
                placeholder="1"
              />
            </div>
          </div>
           <p className="text-sm text-muted-foreground">If both = 1, no GQA scaling applied.</p>
        </div>

        <div className="space-y-2">
          <Label>Context Length</Label>
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
          <Label htmlFor="quantSize">GGUF Quantization</Label>
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
          <p className="text-sm text-muted-foreground">F16은 기본값, Q8과 Q4는 K/V 캐시 양자화에 사용됩니다.</p>
        </div>

        <Card className="bg-muted/50">
             <CardHeader className="p-4">
                 <CardTitle className="text-lg">Estimated VRAM</CardTitle>
             </CardHeader>
             <CardContent className="p-4 space-y-2">
                <p>Model Memory: <span className="font-semibold">{isFinite(modelMemGB) ? modelMemGB.toFixed(2) : 'N/A'}</span> GB</p>
                <p>Context Memory: <span className="font-semibold">{isFinite(contextMemGB) ? contextMemGB.toFixed(2) : 'N/A'}</span> GB</p>
                <p className="text-lg"><strong>Total VRAM Needed: <span className="font-semibold">{isFinite(totalMemGB) ? totalMemGB.toFixed(2) : 'N/A'}</span> GB</strong></p>
             </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
