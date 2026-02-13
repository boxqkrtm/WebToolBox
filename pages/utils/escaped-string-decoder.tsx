import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import UtilsLayout from "@/components/layout/UtilsLayout";
import { useI18n } from "@/lib/i18n/i18nContext";

export default function EscapedStringDecoder() {
  const { t } = useI18n();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const convertText = () => {
    try {
      // Extract text between quotes if present
      const match = input.match(/:\s*"([^"]*)"/)
      const text = match ? match[1] : input;

      // Unescape the Unicode escape sequences and other special characters
      const unescaped = text
        .replace(/\\u([0-9a-fA-F]{4})/g, (match, hex) => {
          return String.fromCodePoint(parseInt(hex, 16));
        })
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '\r')
        .replace(/\\t/g, '\t')
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\')
        .replace(/,,/g, ',');  // Handle double commas

      setOutput(unescaped);
    } catch (error: any) {
      setOutput(`${t('common.tools.escapedStringDecoder.page.errorPrefix')}: ${error.message}`);
    }
  };

  return (
    <UtilsLayout>
      <h1 className="text-2xl font-bold mb-4">{t('common.tools.escapedStringDecoder.title')}</h1>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="input">{t('common.tools.escapedStringDecoder.page.inputLabel')}</Label>
            <Textarea
              id="input"
              placeholder={t('common.tools.escapedStringDecoder.page.inputPlaceholder')}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="font-mono"
            />
          </div>

          <Button onClick={convertText}>{t('common.tools.escapedStringDecoder.page.convert')}</Button>

          <div className="space-y-2">
            <Label htmlFor="output">{t('common.tools.escapedStringDecoder.page.outputLabel')}</Label>
            <Textarea
              id="output"
              value={output}
              readOnly
              className="font-mono"
            />
          </div>
        </CardContent>
      </Card>
    </UtilsLayout>
  );
}
