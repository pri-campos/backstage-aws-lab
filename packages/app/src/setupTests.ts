import '@testing-library/jest-dom';

Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: () => ({}),
});

type ConsoleMethod = (...args: any[]) => void;

const shouldIgnore = (msg: string): boolean => {
  if (
    msg.includes('React Router Future Flag Warning') ||
    msg.includes('v7_startTransition') ||
    msg.includes('v7_relativeSplatPath')
  ) {
    return true;
  }

  if (msg.includes('findDOMNode is deprecated')) {
    return true;
  }

  return false;
};

const wrapConsole = (method: 'warn' | 'error'): void => {
  const original = console[method] as ConsoleMethod;

  console[method] = (...args: any[]) => {
    const msg = String(args[0] ?? '');
    if (shouldIgnore(msg)) return;
    original(...args);
  };
};

wrapConsole('warn');
wrapConsole('error');
