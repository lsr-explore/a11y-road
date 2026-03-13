import 'vitest-canvas-mock';
import '@testing-library/jest-dom/vitest';
import { expect } from 'vitest';
import * as matchers from 'vitest-axe/matchers';

expect.extend(matchers);

// Suppress jsdom "Not implemented" stderr noise from axe-core
const originalStderrWrite = process.stderr.write.bind(process.stderr);
process.stderr.write = ((
  chunk: string | Uint8Array,
  encoding?: BufferEncoding,
  callback?: (err?: Error | null) => void,
) => {
  if (typeof chunk === 'string' && chunk.includes('Not implemented:')) {
    return true;
  }
  return originalStderrWrite(chunk, encoding, callback);
}) as typeof process.stderr.write;
