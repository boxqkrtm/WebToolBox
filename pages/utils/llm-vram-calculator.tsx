import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, CheckCircle, XCircle, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  Q8_0: 8.5,
  F16: 16,
  F32: 32
};

const kvCacheQuants: { [key: string]: number } = {
  "F16": 16,
  "Q8": 8,
  "Q4": 4
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

interface ModelConfig {
  hidden_size: number;
  num_attention_heads: number;
  num_hidden_layers: number;
  num_key_value_heads?: number;
  torch_dtype?: string;
}

type SizeFetchStatus = 'idle' | 'loading' | 'fetched' | 'failed';

export default function LlmVramCalculator() {
  const [modelId, setModelId] = useState<string>("Qwen/Qwen3-0.6B");
  const [hfToken, setHfToken] = useState<string>("");
  const [modelConfig, setModelConfig] = useState<ModelConfig | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [modelSize, setModelSize] = useState<number>(0.5);
  const [fetchedModelSizeB, setFetchedModelSizeB] = useState<number | null>(null);
  const [sizeFetchStatus, setSizeFetchStatus] = useState<SizeFetchStatus>('idle');

  const [contextLength, setContextLength] = useState<string>("32768");
  const [quantKey, setQuantKey] = useState<string>('Q4_K_M');
  const [kvQuantKey, setKvQuantKey] = useState<string>('F16');
  const [overheadGB, setOverheadGB] = useState<number>(0);
  const [batchSize, setBatchSize] = useState<number>(512);

  const [modelMemGB, setModelMemGB] = useState<number>(0);
  const [contextMemGB, setContextMemGB] = useState<number>(0);
  const [inputBufferGB, setInputBufferGB] = useState<number>(0);
  const [computeBufferGB, setComputeBufferGB] = useState<number>(0);
  const [totalMemGB, setTotalMemGB] = useState<number>(0);

  const getDtypeBytes = (dtype?: string): number => {
    if (!dtype) return 2;
    if (dtype.includes('float16') || dtype.includes('bfloat16')) return 2;
    if (dtype.includes('float32')) return 4;
    return 2;
  };

  const fetchModelConfigAndSize = useCallback(async () => {
    if (!modelId) {
      setError("Please enter a Hugging Face model ID.");
      setModelConfig(null);
      setFetchedModelSizeB(null);
      setSizeFetchStatus('idle');
      setModelMemGB(NaN);
      setContextMemGB(NaN);
      setInputBufferGB(NaN);
      setComputeBufferGB(NaN);
      setTotalMemGB(NaN);
      return;
    }
    setIsLoading(true);
    setSizeFetchStatus('loading');
    setError(null);
    setModelConfig(null);
    setFetchedModelSizeB(null);
    setModelMemGB(NaN);
    setContextMemGB(NaN);
    setInputBufferGB(NaN);
    setComputeBufferGB(NaN);
    setTotalMemGB(NaN);

    const configUrl = `https://huggingface.co/${modelId}/raw/main/config.json`;
    const apiUrl = `https://huggingface.co/api/models/${modelId}`;
    const headers: HeadersInit = {};
    if (hfToken) {
      headers['Authorization'] = `Bearer ${hfToken}`;
    }

    try {
      const configResponse = await fetch(configUrl, { headers });
      if (!configResponse.ok) {
        if (configResponse.status === 401) throw new Error("Unauthorized: Check your Hugging Face token or model permissions for config.");
        if (configResponse.status === 403) throw new Error("Forbidden: Your token may not have access to this gated/private model's config.");
        if (configResponse.status === 404) throw new Error("Model config not found. Check the model ID.");
        throw new Error(`Failed to fetch config: ${configResponse.statusText} (Status: ${configResponse.status})`);
      }
      let config = await configResponse.json();

      if (config.text_config) {
        config = config.text_config;
      }

      if (!config.hidden_size || !config.num_attention_heads || !config.num_hidden_layers) {
        throw new Error("Incomplete model config: Missing required fields (hidden_size, num_attention_heads, num_hidden_layers).");
      }

      const num_key_value_heads = config.num_key_value_heads || config.num_attention_heads;
      const fetchedConfig: ModelConfig = {
        hidden_size: config.hidden_size,
        num_attention_heads: config.num_attention_heads,
        num_hidden_layers: config.num_hidden_layers,
        num_key_value_heads: num_key_value_heads,
        torch_dtype: config.torch_dtype,
      };
      setModelConfig(fetchedConfig);

      try {
        const apiResponse = await fetch(apiUrl, { headers });
        if (!apiResponse.ok) {
          console.warn(`Failed to fetch model API info: ${apiResponse.statusText}. Model size needs manual input.`);
          setSizeFetchStatus('failed');
          setError(prev => prev ? `${prev}\nCould not fetch model size info.` : "Could not fetch model size info. Please enter manually.");
          return;
        }
        const apiData = await apiResponse.json();
        const safetensorsInfo = apiData?.safetensors;
        const totalSize = safetensorsInfo?.total;

        if (totalSize && totalSize > 0) {
          const dtypeBytes = getDtypeBytes(fetchedConfig.torch_dtype);
          const estimatedParametersFromBytes = totalSize / dtypeBytes;
          const adjustedParametersForSize = estimatedParametersFromBytes * 2;
          const sizeBFromBytes = adjustedParametersForSize / 1e9;

          const roundedSizeB = parseFloat(sizeBFromBytes.toFixed(2));

          setFetchedModelSizeB(roundedSizeB);
          setModelSize(roundedSizeB);
          setSizeFetchStatus('fetched');
        } else {
          setSizeFetchStatus('failed');
          setError(prev => prev ? `${prev}\nCould not determine model size from API. Please enter manually.` : "Could not determine model size from API. Please enter manually.");
        }
      } catch (apiErr: any) {
        setSizeFetchStatus('failed');
        setError(prev => prev ? `${prev}\nError fetching model size info. Please enter manually.` : `Error fetching model size info: ${apiErr.message}. Please enter manually.`);
      }

    } catch (err: any) {
      setError(err.message || "An unknown error occurred while fetching model data.");
      setModelConfig(null);
      setFetchedModelSizeB(null);
      setSizeFetchStatus('failed');
    } finally {
      setIsLoading(false);
    }
  }, [modelId, hfToken]);

  const calculate = useCallback(() => {
    const sizeB = modelSize;
    const bpw = ggufQuants[quantKey];
    const kvBits = kvCacheQuants[kvQuantKey];
    const context = parseInt(contextLength);
    const bsz = batchSize;
    const extraOverhead = overheadGB;

    let currentError = error;
    if (currentError && (currentError.includes("Invalid") || currentError.includes("Cannot calculate"))) {
        currentError = null;
    }

    if (!modelConfig || sizeFetchStatus === 'loading' || isNaN(bsz) || bsz <= 0) {
      setModelMemGB(NaN); setContextMemGB(NaN); setInputBufferGB(NaN); setComputeBufferGB(NaN); setTotalMemGB(NaN);
      return;
    }

    let validationError = null;
    if (isNaN(sizeB) || sizeB <= 0) validationError = "Invalid Model Size.";
    else if (isNaN(bpw) || bpw <= 0) validationError = "Invalid GGUF Quantization selected.";
    else if (isNaN(context) || context < 1) validationError = "Invalid Context Length.";
    else if (isNaN(kvBits) || kvBits <= 0) validationError = "Invalid KV Cache Quantization selected.";
    else if (isNaN(extraOverhead) || extraOverhead < 0) validationError = "Invalid Overhead value.";

    if (validationError) {
        setError(validationError);
        setModelMemGB(NaN); setContextMemGB(NaN); setInputBufferGB(NaN); setComputeBufferGB(NaN); setTotalMemGB(NaN);
        return;
    }
    setError(currentError);

    const bytes_per_gib = 1024 ** 3;

    const modelBytes = sizeB * 1e9 * bpw / 8;
    const calculatedModelGB = modelBytes / bytes_per_gib;

    const num_layers = modelConfig.num_hidden_layers;
    const head_dim = modelConfig.num_attention_heads > 0 ? modelConfig.hidden_size / modelConfig.num_attention_heads : 0;
    const num_kv_heads = modelConfig.num_key_value_heads ?? modelConfig.num_attention_heads;
    const num_q_heads = modelConfig.num_attention_heads;

    if (isNaN(head_dim) || head_dim <= 0 || !Number.isInteger(head_dim)) {
      const headError = "Invalid model config: Cannot calculate valid head dimension (hidden_size / num_attention_heads).";
      setError(headError);
      setModelMemGB(NaN); setContextMemGB(NaN); setInputBufferGB(NaN); setComputeBufferGB(NaN); setTotalMemGB(NaN);
      return;
    }
    // kv
    const kvBytesPerTokenPerLayer = 2 * num_kv_heads * head_dim * (kvBits / 8);
    const totalKvBytes = context * num_layers * kvBytesPerTokenPerLayer;

    // 절감률 계산 (full attention 기준: kv_heads = q_heads)
    const fullKvBytes = context * modelConfig.num_hidden_layers * (2 * num_q_heads * head_dim * (kvBits / 8));
    const savingFactor = fullKvBytes / totalKvBytes;

    console.log(`Total KV Cache Size: ${(totalKvBytes / (1024 * 1024)).toFixed(2)} MB`);
    if (savingFactor > 1) {
      console.log(`💡 GQA enabled: KV cache uses ${savingFactor.toFixed(1)}x less memory than full attention.`);
    } else {
      console.log(`Standard attention: no KV memory saving.`);
    }

    const calculatedCtxGB = totalKvBytes / bytes_per_gib;

    const bytes_i32 = 4;
    const bytes_f32 = 4;
    const inp_tokens_b = bsz * bytes_i32;
    const inp_embd_b = modelConfig.hidden_size * bsz * bytes_f32;
    const inp_pos_b = bsz * bytes_i32;
    const inp_KQ_mask_b = context * bsz * bytes_f32;
    const inp_K_shift_b = context * bytes_i32;
    const inp_sum_b = bsz * bytes_f32;
    const totalInputBufferBytes = inp_tokens_b + inp_embd_b + inp_pos_b + inp_KQ_mask_b + inp_K_shift_b + inp_sum_b;
    const calculatedInputBufGB = totalInputBufferBytes / bytes_per_gib;

    const computeBufferMiB = (context / 1024.0 * 2.0 + 0.75) * modelConfig.num_attention_heads;
    const computeBufferBytes = computeBufferMiB * 1024 * 1024;
    const calculatedComputeBufGB = computeBufferBytes / bytes_per_gib;

    const total = calculatedModelGB + calculatedCtxGB + calculatedInputBufGB + calculatedComputeBufGB + extraOverhead;

    setModelMemGB(calculatedModelGB);
    setContextMemGB(calculatedCtxGB);
    setInputBufferGB(calculatedInputBufGB);
    setComputeBufferGB(calculatedComputeBufGB);
    setTotalMemGB(total);

  }, [modelSize, quantKey, kvQuantKey, contextLength, overheadGB, modelConfig, error, sizeFetchStatus, batchSize]);

  useEffect(() => {
    if (modelConfig && !isLoading && (sizeFetchStatus === 'fetched' || sizeFetchStatus === 'failed')) {
      calculate();
    } else if (!isLoading && !modelConfig) {
      setModelMemGB(NaN);
      setContextMemGB(NaN);
      setInputBufferGB(NaN);
      setComputeBufferGB(NaN);
      setTotalMemGB(NaN);
    }
  }, [calculate, modelConfig, sizeFetchStatus, isLoading]);

  const handleNumberChange = (setter: React.Dispatch<React.SetStateAction<number>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setter(isNaN(value) && e.target.value !== '' ? NaN : value);
    if (setter === setModelSize && (sizeFetchStatus === 'fetched' || sizeFetchStatus === 'failed')) {
      setSizeFetchStatus('idle');
      setFetchedModelSizeB(null);
    }
  };

  const handleNumberBlur = (stateValue: number, setter: React.Dispatch<React.SetStateAction<number>>, defaultValue: number = 0, minValue: number = 0) => (e: React.FocusEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (e.target.value === '' || isNaN(value) || value < minValue) {
      setter(defaultValue);
      if (setter === setModelSize && (sizeFetchStatus === 'fetched' || sizeFetchStatus === 'failed')) {
        setSizeFetchStatus('idle');
        setFetchedModelSizeB(null);
      }
    } else {
      setter(value);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>LLM VRAM Calculator (GGUF Estimate)</CardTitle>
        <CardDescription>Estimate VRAM usage including compute/input buffers based on Hugging Face model config and quantization.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 border p-4 rounded-md">
          <Label htmlFor="modelId">Hugging Face Model ID</Label>
          <Input
            id="modelId"
            type="text"
            value={modelId}
            onChange={(e) => setModelId(e.target.value)}
            placeholder="e.g., mistralai/Mistral-7B-v0.1"
            disabled={isLoading}
          />

          <Label htmlFor="hfToken">Hugging Face Token (Optional)</Label>
          <Input
            id="hfToken"
            type="password"
            value={hfToken}
            onChange={(e) => setHfToken(e.target.value)}
            placeholder="Enter token for private/gated models"
            disabled={isLoading}
          />
          <p className="text-sm text-muted-foreground">비공개 또는 게이트된 모델에 접근하려면 토큰이 필요합니다.</p>

          <Button onClick={fetchModelConfigAndSize} disabled={isLoading || !modelId} className="w-full mt-2">
            {isLoading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...</>
            ) : (
              "Load Model Info"
            )}
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="modelSize">Model Size (Billion Parameters)</Label>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              {sizeFetchStatus === 'fetched' && <><CheckCircle className="h-3 w-3 text-green-500" /><span>Fetched</span></>}
              {sizeFetchStatus === 'failed' && <><XCircle className="h-3 w-3 text-red-500" /><span>Fetch failed</span></>}
              {sizeFetchStatus === 'loading' && <><Loader2 className="h-3 w-3 animate-spin" /><span>Fetching...</span></>}
              {sizeFetchStatus === 'idle' && <><HelpCircle className="h-3 w-3" /><span>Load or enter manually</span></>}
            </div>
          </div>
          <Input
            id="modelSize"
            type="number"
            min="0"
            step="0.01"
            value={isNaN(modelSize) ? '' : modelSize}
            onChange={handleNumberChange(setModelSize)}
            onBlur={handleNumberBlur(modelSize, setModelSize, 0, 0)}
            placeholder="e.g., 7"
            disabled={isLoading}
          />
          <p className="text-sm text-muted-foreground">
            모델 가중치 메모리 계산에 사용됩니다. 'Load Model Info' 버튼으로 가져오거나 수동 입력하세요.
            {sizeFetchStatus === 'failed' && " 자동 가져오기 실패. 정확한 값을 입력해주세요."}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="batchSize">Batch Size (Tokens)</Label>
          <Input
            id="batchSize"
            type="number"
            min="1"
            step="1"
            value={isNaN(batchSize) ? '' : batchSize}
            onChange={handleNumberChange(setBatchSize)}
            onBlur={handleNumberBlur(batchSize, setBatchSize, 512, 1)}
            placeholder="e.g., 512"
            disabled={isLoading || !modelConfig}
          />
          <p className="text-sm text-muted-foreground">Input/Compute 버퍼 계산에 사용됩니다. (llama.cpp 기본값: 512)</p>
        </div>

        <div className="space-y-2">
          <Label>Context Length (Tokens)</Label>
          <RadioGroup value={contextLength} onValueChange={setContextLength} className="grid grid-cols-3 gap-2">
            {contextOptions.map(option => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`context-${option.value}`} disabled={isLoading || !modelConfig} />
                <Label htmlFor={`context-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
          <p className="text-sm text-muted-foreground">모델 정보를 로드해야 활성화됩니다.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantSize">GGUF Weight Quantization</Label>
          <Select value={quantKey} onValueChange={setQuantKey} disabled={isLoading || !modelConfig}>
            <SelectTrigger id="quantSize">
              <SelectValue placeholder="Select quantization" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(ggufQuants).map(key => (
                <SelectItem key={key} value={key}>{key}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">모델 가중치의 정밀도 (bits per weight). 모델 정보를 로드해야 활성화됩니다.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="kvQuantSize">KV Cache Quantization</Label>
          <Select value={kvQuantKey} onValueChange={setKvQuantKey} disabled={isLoading || !modelConfig}>
            <SelectTrigger id="kvQuantSize">
              <SelectValue placeholder="Select KV cache quantization" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(kvCacheQuants).map(([key, value]) => (
                <SelectItem key={key} value={key}>{key} ({value}-bit)</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">K/V 캐시 요소의 정밀도. F16이 기본값입니다. 모델 정보를 로드해야 활성화됩니다.</p>
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
            placeholder="e.g., 1.5"
            disabled={isLoading || !modelConfig}
          />
          <p className="text-sm text-muted-foreground">CUDA 컨텍스트, 프레임워크, 기타 버퍼 등. 기본값 1.5GB에서 조절해보세요.</p>
        </div>

        <Card className={`bg-muted/50 ${(!modelConfig || error || modelSize <= 0 || sizeFetchStatus === 'loading') ? 'opacity-50' : ''}`}>
          <CardHeader className="p-4">
            <CardTitle className="text-lg">Estimated VRAM Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            {modelConfig && !error && modelSize > 0 && !isLoading && isFinite(totalMemGB) ? (
              <>
                <p>Model Weights: <span className="font-semibold">{isFinite(modelMemGB) ? modelMemGB.toFixed(2) : 'N/A'}</span> GB</p>
                <p>KV Cache: <span className="font-semibold">{isFinite(contextMemGB) ? contextMemGB.toFixed(2) : 'N/A'}</span> GB</p>
                <p>Input Buffer: <span className="font-semibold">{isFinite(inputBufferGB) ? inputBufferGB.toFixed(2) : 'N/A'}</span> GB</p>
                <p>Compute Buffer: <span className="font-semibold">{isFinite(computeBufferGB) ? computeBufferGB.toFixed(2) : 'N/A'}</span> GB</p>
                <p>Overhead: <span className="font-semibold">{isFinite(overheadGB) ? overheadGB.toFixed(2) : 'N/A'}</span> GB</p>
                <p className="text-lg"><strong>Total Estimated VRAM: <span className="font-semibold">{totalMemGB.toFixed(2)}</span> GB</strong></p>
              </>
            ) : (
              <p className="text-muted-foreground">
                {isLoading ? 'Loading data...' :
                 (error ? `Calculation failed: ${error}` :
                  (!modelConfig && sizeFetchStatus !== 'loading' ? 'Click "Load Model Info" to start.' :
                   (modelSize <= 0 && sizeFetchStatus !== 'loading' ? 'Enter a valid model size or load model info.' :
                    'Calculating...')))}
              </p>
            )}
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}