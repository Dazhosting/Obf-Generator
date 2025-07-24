import { obfuscate } from 'javascript-obfuscator';

const getUltraObfuscationConfig = () => {
  const generateUltraName = () => {
    const chars = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const randomNum = numbers[Math.floor(Math.random() * numbers.length)];
    const randomChar = chars[Math.floor(Math.random() * chars.length)];
    return `z${randomNum}${randomChar}${Math.random().toString(36).substring(2, 6)}`;
  };

  return {
    compact: true,
    renameVariables: true,
    renameGlobals: true,
    identifierNamesGenerator: 'custom',
    identifiersDictionary: Array.from({ length: 100 }, () => generateUltraName()),
    stringCompression: true,
    stringArray: true,
    splitStrings: true,
    splitStringsChunkLength: 4,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.9,
    shuffleStringArray: true,
    selfDefending: true,
    disableConsoleOutput: true,
    debugProtection: true,
    debugProtectionInterval: true,
    stringArrayEncoding: ['rc4'],
    stringArrayThreshold: 1,
    sourceMap: false
  };
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST method allowed' });
  }

  const { code } = await req.json();

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing "code"' });
  }

  try {
    const result = obfuscate(code, getUltraObfuscationConfig()).getObfuscatedCode();
    return res.status(200).json({ obfuscated: result });
  } catch (err) {
    return res.status(500).json({ error: 'Obfuscation failed', detail: err.message });
  }
}
