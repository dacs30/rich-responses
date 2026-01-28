/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CodeSandbox } from '@/components/code-sandbox';
import { Loader2 } from 'lucide-react';

type Agent = 'openai' | 'anthropic';

export default function Home() {
  const [agent, setAgent] = useState<Agent>('openai');
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setIsLoading(true);
    setError('');
    setGeneratedCode('');

    try {
      const response = await fetch(`/api/generate/${agent}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate code');
      }

      setGeneratedCode(data.code);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Rich responses</h1>
          <p className="text-muted-foreground">
            AI should not be limited to plain text.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Input */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Generate Component</CardTitle>
              <CardDescription>
                Describe the UI you want to create
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">AI Agent</label>
                <Select value={agent} onValueChange={(value: Agent) => setAgent(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">OpenAI (GPT-5.2)</SelectItem>
                    <SelectItem value="anthropic">Anthropic (Claude)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 flex-1">
                <label className="text-sm font-medium">Prompt</label>
                <Textarea
                  placeholder="e.g., Create a modern login form with email, password, and a remember me checkbox"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[200px] resize-none"
                />
              </div>

              {error && (
                <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <Button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate UI'
                )}
              </Button>

              {generatedCode && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Generated Code</label>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto max-h-[300px] overflow-y-auto">
                      <code>{generatedCode}</code>
                    </pre>
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => navigator.clipboard.writeText(generatedCode)}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Right Panel - Preview */}
          <Card className="flex flex-col min-h-[600px]">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>
                Live preview of your generated component
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <CodeSandbox code={generatedCode} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
