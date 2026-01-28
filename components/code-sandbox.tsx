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

      // Remove all import statements (including multi-line imports)
      componentCode = componentCode.replace(/^import\s+.*?from\s+['"].*?['"];?\s*$/gm, '');
      componentCode = componentCode.replace(/^import\s+['"].*?['"];?\s*$/gm, '');
      componentCode = componentCode.replace(/^import\s+(?:\*\s+as\s+\w+|{[\s\S]*?})\s+from\s+['"].*?['"];?\s*$/gm, '');
      componentCode = componentCode.replace(/import\s+[\s\S]*?from\s+['"].*?['"]/g, '');
      
      // Remove TypeScript type definitions - more aggressive approach
      // Remove type alias declarations with object bodies (multi-line)
      componentCode = componentCode.replace(/^type\s+\w+\s*=\s*\{[^}]*\}\s*$/gm, '');
      // Remove type alias declarations with union types
      componentCode = componentCode.replace(/^type\s+\w+\s*=\s*[^\n]+$/gm, '');
      // Remove interface declarations
      componentCode = componentCode.replace(/^interface\s+\w+\s*\{[^}]*\}/gm, '');
      
      // Remove type annotations from variables, parameters, and return types
      // Remove from const/let/var declarations: const x: Type = ...
      componentCode = componentCode.replace(/:\s*\w+(?:<[^>]+>)?(?:\[\])?(?=\s*[=\)])/g, '');
      // Remove from array type annotations: Type[]
      componentCode = componentCode.replace(/:\s*\w+\[\]/g, '');
      // Remove from generic useState: useState<Type>
      componentCode = componentCode.replace(/<[^>]+>(?=\()/g, '');
      // Remove function return type annotations
      componentCode = componentCode.replace(/\)\s*:\s*(?:JSX\.Element|React\.ReactElement|ReactNode|void|any|[\w\[\]]+)(?=\s*[{=>])/g, ')');
      // Remove as type assertions
      componentCode = componentCode.replace(/\s+as\s+\w+/g, '');
      // Remove non-null assertions (!)
      componentCode = componentCode.replace(/!(?=[\.\[\),;])/g, '');
      
      // Remove export default and just keep the function
      componentCode = componentCode.replace(/^export\s+default\s+/gm, '');
      componentCode = componentCode.trim();

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
    const { useState, useEffect, useRef, useMemo, useCallback, useReducer, useContext, createContext } = React;
    
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
    
    const Select = ({ children, className = '', value, onValueChange, ...props }) => {
      const [localValue, setLocalValue] = React.useState(value);
      React.useEffect(() => setLocalValue(value), [value]);
      
      return (
        <select 
          className={\`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 \${className}\`}
          value={localValue}
          onChange={(e) => {
            setLocalValue(e.target.value);
            onValueChange?.(e.target.value);
          }}
          {...props}
        >
          {children}
        </select>
      );
    };
    
    const SelectTrigger = ({ children, className = '', ...props }) => children;
    const SelectContent = ({ children, ...props }) => children;
    const SelectItem = ({ children, value, ...props }) => (
      <option value={value} {...props}>{children}</option>
    );
    const SelectValue = ({ placeholder }) => null;
    
    const Checkbox = ({ className = '', ...props }) => (
      <input 
        type="checkbox"
        className={\`h-4 w-4 rounded border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 \${className}\`}
        {...props}
      />
    );
    
    const Badge = ({ children, className = '', variant, ...props }) => (
      <div className={\`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors \${variant === 'outline' ? 'border-current' : variant === 'secondary' ? 'bg-secondary text-secondary-foreground' : 'border-transparent'} \${className}\`} {...props}>
        {children}
      </div>
    );
    
    const Separator = ({ className = '', orientation = 'horizontal', ...props }) => (
      <div className={\`shrink-0 bg-border \${orientation === 'vertical' ? 'h-full w-[1px]' : 'h-[1px] w-full'} \${className}\`} {...props} />
    );
    
    const Tabs = ({ children, defaultValue, className = '', ...props }) => {
      const [activeTab, setActiveTab] = React.useState(defaultValue);
      return (
        <div className={\`\${className}\`} {...props}>
          {React.Children.map(children, child => 
            React.isValidElement(child) ? React.cloneElement(child, { activeTab, setActiveTab }) : child
          )}
        </div>
      );
    };
    
    const TabsList = ({ children, className = '', activeTab, setActiveTab, ...props }) => (
      <div className={\`inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground \${className}\`} {...props}>
        {React.Children.map(children, child =>
          React.isValidElement(child) ? React.cloneElement(child, { activeTab, setActiveTab }) : child
        )}
      </div>
    );
    
    const TabsTrigger = ({ children, value, className = '', activeTab, setActiveTab, ...props }) => (
      <button
        className={\`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 \${activeTab === value ? 'bg-background text-foreground shadow-sm' : ''} \${className}\`}
        onClick={() => setActiveTab(value)}
        {...props}
      >
        {children}
      </button>
    );
    
    const TabsContent = ({ children, value, className = '', activeTab, ...props }) => (
      activeTab === value ? <div className={\`\${className}\`} {...props}>{children}</div> : null
    );
    
    const Progress = ({ value = 0, className = '', ...props }) => (
      <div className={\`relative h-4 w-full overflow-hidden rounded-full bg-secondary \${className}\`} {...props}>
        <div className="h-full w-full flex-1 bg-primary transition-all" style={{ transform: \`translateX(-\${100 - (value || 0)}%)\` }} />
      </div>
    );
    
    try {
      ${componentCode}
      
      // Find the component function - try multiple patterns
      let Component = null;
      
      // Get all defined variables/functions in current scope
      const allKeys = Object.keys(window).concat(Object.getOwnPropertyNames(window));
      
      // Filter for React components (functions starting with uppercase)
      const excludedNames = ['Button', 'Card', 'CardHeader', 'CardTitle', 'CardDescription', 'CardContent', 'CardFooter', 'Input', 'Textarea', 'Label', 'Select', 'SelectTrigger', 'SelectContent', 'SelectItem', 'SelectValue', 'Checkbox', 'Badge', 'Separator', 'Tabs', 'TabsList', 'TabsTrigger', 'TabsContent', 'Progress', 'React', 'ReactDOM'];
      
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
