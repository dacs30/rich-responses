'use client';

import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';

interface CodeSandboxProps {
  code: string;
}

export function CodeSandbox({ code }: CodeSandboxProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!code || !iframeRef.current) return;

    try {
      // Extract component code and clean it
      let componentCode = code;
      
      // Remove markdown code blocks if present
      componentCode = componentCode.replace(/```(?:tsx?|jsx?|typescript|javascript)?\n/g, '');
      componentCode = componentCode.replace(/```\n?$/g, '');
      componentCode = componentCode.trim();

      // Remove import statements - we'll provide these in the sandbox
      componentCode = componentCode.replace(/^import\s+.*?from\s+['"].*?['"];?\s*$/gm, '');
      componentCode = componentCode.replace(/^import\s+['"].*?['"];?\s*$/gm, '');
      
      // Remove export default and just keep the function
      componentCode = componentCode.replace(/^export\s+default\s+/gm, '');
      componentCode = componentCode.trim();

      // Escape backticks and template literals for safe injection
      const escapedCode = componentCode.replace(/`/g, '\\`').replace(/\$/g, '\\$');

      // Create the HTML document for the iframe
      const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      padding: 1rem;
      font-family: system-ui, -apple-system, sans-serif;
      background: white;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    const { useState, useEffect, useRef } = React;
    
    // Stub for shadcn components
    const Button = ({ children, className = '', variant, size, asChild, ...props }) => (
      <button 
        className={\`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 \${variant === 'outline' ? 'border border-input bg-background hover:bg-accent hover:text-accent-foreground' : variant === 'ghost' ? 'hover:bg-accent hover:text-accent-foreground' : variant === 'destructive' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : variant === 'secondary' ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80' : 'bg-primary text-primary-foreground hover:bg-primary/90'} \${size === 'sm' ? 'h-9 px-3' : size === 'lg' ? 'h-11 px-8' : size === 'icon' ? 'h-10 w-10' : 'h-10 px-4 py-2'} \${className}\`}
        {...props}
      >
        {children}
      </button>
    );
    
    const Card = ({ children, className = '', ...props }) => (
      <div className={\`rounded-lg border bg-card text-card-foreground shadow-sm \${className}\`} {...props}>
        {children}
      </div>
    );
    
    const CardHeader = ({ children, className = '', ...props }) => (
      <div className={\`flex flex-col space-y-1.5 p-6 \${className}\`} {...props}>
        {children}
      </div>
    );
    
    const CardTitle = ({ children, className = '', ...props }) => (
      <h3 className={\`text-2xl font-semibold leading-none tracking-tight \${className}\`} {...props}>
        {children}
      </h3>
    );
    
    const CardDescription = ({ children, className = '', ...props }) => (
      <p className={\`text-sm text-muted-foreground \${className}\`} {...props}>
        {children}
      </p>
    );
    
    const CardContent = ({ children, className = '', ...props }) => (
      <div className={\`p-6 pt-0 \${className}\`} {...props}>
        {children}
      </div>
    );
    
    const CardFooter = ({ children, className = '', ...props }) => (
      <div className={\`flex items-center p-6 pt-0 \${className}\`} {...props}>
        {children}
      </div>
    );
    
    const Input = ({ className = '', type = 'text', ...props }) => (
      <input
        type={type}
        className={\`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 \${className}\`}
        {...props}
      />
    );
    
    const Textarea = ({ className = '', ...props }) => (
      <textarea
        className={\`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 \${className}\`}
        {...props}
      />
    );
    
    const Label = ({ children, className = '', htmlFor, ...props }) => (
      <label htmlFor={htmlFor} className={\`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 \${className}\`} {...props}>
        {children}
      </label>
    );
    
    const Select = ({ children, className = '', ...props }) => (
      <select className={\`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 \${className}\`} {...props}>
        {children}
      </select>
    );
    
    const Checkbox = ({ className = '', ...props }) => (
      <input 
        type="checkbox"
        className={\`h-4 w-4 rounded border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 \${className}\`}
        {...props}
      />
    );
    
    const Badge = ({ children, className = '', variant, ...props }) => (
      <div className={\`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors \${variant === 'outline' ? 'border-current' : 'border-transparent'} \${className}\`} {...props}>
        {children}
      </div>
    );
    
    try {
      ${escapedCode}
      
      // Find the component function - try multiple patterns
      let Component = null;
      
      // Get all defined variables/functions in current scope
      const allKeys = Object.keys(window).concat(Object.getOwnPropertyNames(window));
      
      // Filter for React components (functions starting with uppercase)
      const excludedNames = ['Button', 'Card', 'CardHeader', 'CardTitle', 'CardDescription', 'CardContent', 'CardFooter', 'Input', 'Textarea', 'Label', 'Select', 'Checkbox', 'Badge', 'React', 'ReactDOM'];
      
      for (let key of allKeys) {
        if (excludedNames.includes(key)) continue;
        if (/^[A-Z]/.test(key) && typeof window[key] === 'function') {
          Component = window[key];
          console.log('Found component:', key);
          break;
        }
      }
      
      if (Component) {
        ReactDOM.render(<Component />, document.getElementById('root'));
      } else {
        document.getElementById('root').innerHTML = '<div style="padding: 20px; color: #ef4444;"><strong>Unable to find component.</strong><br/>Make sure your code exports a React component with a capitalized name.<br/><br/>Debug info: Check console for details.</div>';
        console.log('Available functions:', allKeys.filter(k => typeof window[k] === 'function' && /^[A-Z]/.test(k)));
      }
    } catch (err) {
      document.getElementById('root').innerHTML = '<div style="padding: 20px; color: #ef4444;"><strong>Render Error:</strong><br/>' + err.message + '<br/><br/><small>Check browser console for full error.</small></div>';
      console.error('Full error:', err);
    }
  </script>
</body>
</html>`;

      const iframe = iframeRef.current;
      iframe.srcdoc = html;
      setError('');
    } catch (err: any) {
      setError(err.message);
    }
  }, [code]);

  if (!code) {
    return (
      <Card className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">Generated UI will appear here</p>
      </Card>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-4">
          <p className="font-medium">Render Error:</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
      <Card className="flex-1 overflow-hidden">
        <iframe
          ref={iframeRef}
          className="w-full h-full border-0"
          sandbox="allow-scripts"
          title="Component Preview"
        />
      </Card>
    </div>
  );
}
