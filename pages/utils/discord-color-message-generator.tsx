import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useI18n } from '@/lib/i18n/i18nContext';

export default function DiscordColorMessageGenerator() {
  const { t } = useI18n();
  const [message, setMessage] = useState("");
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [characterColors, setCharacterColors] = useState<{[key: number]: string}>({});
  const [characterStyles, setCharacterStyles] = useState<{[key: number]: "none" | "bold" | "underline"}>({});
  const [characterBgColors, setCharacterBgColors] = useState<{[key: number]: string}>({});
  const [selectedRange, setSelectedRange] = useState<[number, number] | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // ANSI 지원 색상 목록 - 8가지 기본 색상만 지원
  const ansiColors = [
    { name: t('common.tools.discordColorMessageGenerator.black'), hex: "#000000", code: "0" },
    { name: t('common.tools.discordColorMessageGenerator.red'), hex: "#FF0000", code: "1" },
    { name: t('common.tools.discordColorMessageGenerator.green'), hex: "#00FF00", code: "2" },
    { name: t('common.tools.discordColorMessageGenerator.yellow'), hex: "#FFFF00", code: "3" },
    { name: t('common.tools.discordColorMessageGenerator.blue'), hex: "#0000FF", code: "4" },
    { name: t('common.tools.discordColorMessageGenerator.purple'), hex: "#FF00FF", code: "5" },
    { name: t('common.tools.discordColorMessageGenerator.cyan'), hex: "#00FFFF", code: "6" },
    { name: t('common.tools.discordColorMessageGenerator.white'), hex: "#FFFFFF", code: "7" },
  ];

  // 색상 코드 찾기
  const findColorCode = (hexColor: string) => {
    const color = ansiColors.find(c => c.hex.toLowerCase() === hexColor.toLowerCase());
    return color ? color.code : "7"; // 기본값은 흰색
  };

  // 스타일 코드 가져오기
  const getStyleCode = (style: string) => {
    switch(style) {
      case "bold": return "1";
      case "underline": return "4";
      case "none": 
      default: return "0";
    }
  };

  // 글자별 색상 및 스타일 적용
  const generateCharacterColoredMessage = () => {
    if (!message.trim()) return "";
    
    let coloredMessage = "```ansi\n";
    let currentColor = "";
    let currentBg = "";
    let currentStyle = "";
    
    for (let i = 0; i < message.length; i++) {
      const char = message[i];
      
      // 현재 글자의 스타일, 색상, 배경색 가져오기
      const style = characterStyles[i] || "none";
      const styleCode = getStyleCode(style);
      const hasColor = characterColors[i] && characterColors[i] !== "";
      const hasBgColor = characterBgColors[i] && characterBgColors[i] !== "";
      
      // 새로운 포맷팅 코드가 필요한지 확인
      const needNewFormat = 
        currentStyle !== styleCode ||
        (hasColor && findColorCode(characterColors[i]) !== currentColor) ||
        (hasBgColor && findColorCode(characterBgColors[i]) !== currentBg);
      
      // 현재 글자에 스타일, 색상 또는 배경색이 있는 경우
      if (needNewFormat) {
        currentStyle = styleCode;
        
        // ANSI 코드 시작
        let formatCode = `\u001b[${styleCode}`;
        
        // 텍스트 색상 추가
        if (hasColor) {
          const colorCode = findColorCode(characterColors[i]);
          currentColor = colorCode;
          formatCode += `;3${colorCode}`;
        }
        
        // 배경색 추가
        if (hasBgColor) {
          const bgCode = findColorCode(characterBgColors[i]);
          currentBg = bgCode;
          formatCode += `;4${bgCode}`;
        }
        
        // ANSI 코드 종료
        formatCode += "m";
        coloredMessage += formatCode;
      }
      
      coloredMessage += char;
    }
    
    coloredMessage += "\n```";
    return coloredMessage;
  };

  // 메시지 생성 함수
  const generateColoredMessage = () => {
    if (!message.trim()) return;
    
    const coloredMessage = generateCharacterColoredMessage();
    setResult(coloredMessage);
    
    // 바로 클립보드에 복사
    navigator.clipboard.writeText(coloredMessage).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // 글자에 색상/스타일/배경색 지정
  const setCharacterColor = (index: number, color: string) => {
    setCharacterColors(prev => ({
      ...prev,
      [index]: color
    }));
  };
  
  const setCharacterStyle = (index: number, style: "none" | "bold" | "underline") => {
    setCharacterStyles(prev => ({
      ...prev,
      [index]: style
    }));
  };
  
  const setCharacterBgColor = (index: number, color: string) => {
    setCharacterBgColors(prev => ({
      ...prev,
      [index]: color
    }));
  };

  // 여러 글자에 색상/스타일/배경색 적용
  const applyColorToRange = (color: string) => {
    if (!selectedRange) return;
    
    const [start, end] = selectedRange;
    const newCharacterColors = { ...characterColors };
    
    for (let i = start; i <= end; i++) {
      newCharacterColors[i] = color === "default" ? "" : color;
    }
    
    setCharacterColors(newCharacterColors);
    setSelectedRange(null); // 선택 범위 초기화
  };
  
  const applyStyleToRange = (style: "none" | "bold" | "underline") => {
    if (!selectedRange) return;
    
    const [start, end] = selectedRange;
    const newCharacterStyles = { ...characterStyles };
    
    for (let i = start; i <= end; i++) {
      if (style === "none") {
        delete newCharacterStyles[i]; // 스타일 제거
      } else {
        newCharacterStyles[i] = style;
      }
    }
    
    setCharacterStyles(newCharacterStyles);
    setSelectedRange(null);
  };
  
  const applyBgColorToRange = (color: string) => {
    if (!selectedRange) return;
    
    const [start, end] = selectedRange;
    const newCharacterBgColors = { ...characterBgColors };
    
    for (let i = start; i <= end; i++) {
      newCharacterBgColors[i] = color === "default" ? "" : color;
    }
    
    setCharacterBgColors(newCharacterBgColors);
    setSelectedRange(null);
  };

  // 텍스트 영역 선택 이벤트 핸들러
  const handleTextSelection = () => {
    if (!textAreaRef.current) return;
    
    const start = textAreaRef.current.selectionStart;
    const end = textAreaRef.current.selectionEnd;
    
    if (start !== end) {
      setSelectedRange([start, end - 1]);
    } else {
      setSelectedRange(null);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{t('common.tools.discordColorMessageGenerator.title')}</CardTitle>
          <CardDescription>
            {t('common.tools.discordColorMessageGenerator.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="message">{t('common.tools.discordColorMessageGenerator.message')}</Label>
              <Textarea
                id="message"
                ref={textAreaRef}
                placeholder={t('common.tools.discordColorMessageGenerator.page.inputPlaceholder')}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onMouseUp={handleTextSelection}
                onKeyUp={handleTextSelection}
                className="mt-1"
              />
            </div>
            
            {selectedRange && (
              <div className="p-3 border rounded-md bg-gray-50 dark:bg-gray-800">
                <div className="text-sm font-medium mb-2">
                  {t('common.tools.discordColorMessageGenerator.page.selectedRangeApply')} ({selectedRange[0]} ~ {selectedRange[1]})
                </div>
                <div className="flex flex-col gap-3">
                  <div>
                    <Label className="block mb-1">{t('common.tools.discordColorMessageGenerator.textColor')}:</Label>
                    <div className="flex flex-wrap gap-1">
                      <Button 
                        variant="outline" 
                        className="h-8 px-2 py-0"
                        onClick={() => applyColorToRange("default")}
                      >
                        {t('common.tools.discordColorMessageGenerator.none')}
                      </Button>
                      {ansiColors.map((color) => (
                        <Button 
                          key={color.hex}
                          variant="outline" 
                          className="h-8 w-8 p-0 flex items-center justify-center"
                          style={{
                            backgroundColor: color.hex,
                            color: ['#000000', '#00FF00', '#FFFF00', '#00FFFF', '#FFFFFF'].includes(color.hex) ? 'black' : 'white'
                          }}
                          title={color.name}
                          onClick={() => applyColorToRange(color.hex)}
                        >
                          <span className="sr-only">{color.name}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="block mb-1">{t('common.tools.discordColorMessageGenerator.page.styleLabel')}:</Label>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="h-8"
                        onClick={() => applyStyleToRange("none")}
                      >
                        {t('common.tools.discordColorMessageGenerator.none')}
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-8 font-bold"
                        onClick={() => applyStyleToRange("bold")}
                      >
                        {t('common.tools.discordColorMessageGenerator.bold')}
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-8 underline"
                        onClick={() => applyStyleToRange("underline")}
                      >
                        {t('common.tools.discordColorMessageGenerator.underline')}
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="block mb-1">{t('common.tools.discordColorMessageGenerator.bgColor')}:</Label>
                    <div className="flex flex-wrap gap-1">
                      <Button 
                        variant="outline" 
                        className="h-8 px-2 py-0"
                        onClick={() => applyBgColorToRange("default")}
                      >
                        {t('common.tools.discordColorMessageGenerator.none')}
                      </Button>
                      {ansiColors.map((color) => (
                        <Button 
                          key={color.hex}
                          variant="outline" 
                          className="h-8 w-8 p-0 flex items-center justify-center border-2"
                          style={{
                            backgroundColor: color.hex,
                            color: ['#000000', '#00FF00', '#FFFF00', '#00FFFF', '#FFFFFF'].includes(color.hex) ? 'black' : 'white'
                          }}
                          title={color.name}
                          onClick={() => applyBgColorToRange(color.hex)}
                        >
                          <span className="sr-only">{color.name}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                   
                  <Button variant="outline" size="sm" onClick={() => setSelectedRange(null)} className="mt-1 self-start">
                    {t('common.tools.discordColorMessageGenerator.page.cancel')}
                  </Button>
                </div>
              </div>
            )}
            
            <div>
              <Label className="block mb-2">{t('common.tools.discordColorMessageGenerator.page.charStylePicker')}</Label>
              <div className="mt-2 p-3 border rounded-md max-h-60 overflow-y-auto">
                {message.split('').map((char, index) => (
                  <div key={index} className="inline-block mb-2 mr-2 text-center">
                    <div className="mb-1 w-5 h-5 flex items-center justify-center">{char}</div>
                    <div className="flex flex-col gap-1">
                      {/* 글자 색상 선택 */}
                      <Select 
                        value={characterColors[index] || "default"}
                        onValueChange={(value) => setCharacterColor(index, value === "default" ? "" : value)}
                      >
                        <SelectTrigger className="w-10 h-8 p-0" title={t('common.tools.discordColorMessageGenerator.page.charTextColorTitle')}>
                          <div 
                            className="w-8 h-4 rounded" 
                            style={{ 
                              backgroundColor: characterColors[index] || "transparent",
                              border: characterColors[index] ? "none" : "1px dashed #ccc"
                            }}
                          ></div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">{t('common.tools.discordColorMessageGenerator.page.noTextColor')}</SelectItem>
                          {ansiColors.map((color) => (
                            <SelectItem key={color.hex} value={color.hex}>
                              <div 
                                className="w-4 h-4 rounded-full" 
                                style={{ backgroundColor: color.hex }}
                              ></div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      {/* 글자 스타일 선택 */}
                      <Select 
                        value={characterStyles[index] || "none"}
                        onValueChange={(value) => {
                          if (value === "none") {
                            const newStyles = { ...characterStyles };
                            delete newStyles[index];
                            setCharacterStyles(newStyles);
                          } else {
                            setCharacterStyle(index, value as "none" | "bold" | "underline");
                          }
                        }}
                      >
                        <SelectTrigger className="w-10 h-8 p-0" title={t('common.tools.discordColorMessageGenerator.page.charTextStyleTitle')}>
                          <div className="w-8 h-4 flex items-center justify-center text-xs">
                            {characterStyles[index] === "bold" && "B"}
                            {characterStyles[index] === "underline" && "U"}
                            {(!characterStyles[index] || characterStyles[index] === "none") && "-"}
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">{t('common.tools.discordColorMessageGenerator.none')}</SelectItem>
                          <SelectItem value="bold">{t('common.tools.discordColorMessageGenerator.bold')}</SelectItem>
                          <SelectItem value="underline">{t('common.tools.discordColorMessageGenerator.underline')}</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      {/* 배경 색상 선택 */}
                      <Select 
                        value={characterBgColors[index] || "default"}
                        onValueChange={(value) => setCharacterBgColor(index, value === "default" ? "" : value)}
                      >
                        <SelectTrigger className="w-10 h-8 p-0" title={t('common.tools.discordColorMessageGenerator.page.charBgColorTitle')}>
                          <div 
                            className="w-8 h-4 rounded border" 
                            style={{ 
                              backgroundColor: characterBgColors[index] || "transparent",
                              borderStyle: characterBgColors[index] ? "solid" : "dashed"
                            }}
                          ></div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">{t('common.tools.discordColorMessageGenerator.page.noBgColor')}</SelectItem>
                          {ansiColors.map((color) => (
                            <SelectItem key={color.hex} value={color.hex}>
                              <div 
                                className="w-4 h-4 rounded-full" 
                                style={{ backgroundColor: color.hex }}
                              ></div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          <Button onClick={generateColoredMessage} className="w-full mt-4">
            {t('common.tools.discordColorMessageGenerator.page.generateAndCopy')}
          </Button>
          
          {result && (
            <div className="space-y-2 mt-4">
              <div className="relative">
                <Textarea
                  id="result"
                  value={result}
                  readOnly
                  className="mt-1 font-mono"
                  rows={5}
                />
              </div>
              <div className="mt-4">
                <div className="text-sm font-medium">{t('common.tools.discordColorMessageGenerator.page.preview')}:</div>
                <div
                  className="p-4 rounded-md border mt-2"
                  style={{ 
                    backgroundColor: "#36393F", // Discord 다크 모드 배경
                  }}
                >
                  <div>
                    {message.split('').map((char, index) => (
                      <span 
                        key={index} 
                        style={{ 
                          color: characterColors[index] || "#FFFFFF", // 기본 흰색
                          backgroundColor: characterBgColors[index] || "transparent",
                          fontWeight: characterStyles[index] === "bold" ? "bold" : "normal",
                          textDecoration: characterStyles[index] === "underline" ? "underline" : "none"
                        }}
                      >
                        {char}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('common.tools.discordColorMessageGenerator.page.howToTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2">
            <li>{t('common.tools.discordColorMessageGenerator.page.step1')}</li>
            <li>{t('common.tools.discordColorMessageGenerator.page.step2')}</li>
            <li>{t('common.tools.discordColorMessageGenerator.page.step3')}</li>
            <li>{t('common.tools.discordColorMessageGenerator.page.step4')}</li>
            <li>{t('common.tools.discordColorMessageGenerator.page.step5')}</li>
            <li>{t('common.tools.discordColorMessageGenerator.page.step6')}</li>
          </ol>
          <p className="mt-4 text-sm text-gray-500">
            {t('common.tools.discordColorMessageGenerator.page.note')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
