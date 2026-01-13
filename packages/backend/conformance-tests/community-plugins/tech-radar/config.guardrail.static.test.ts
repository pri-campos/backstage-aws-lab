
import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
import { ConfigReader } from '@backstage/config';

function readAppConfig(): ConfigReader {
  const appConfigPath = path.resolve(__dirname, '../../../../../app-config.yaml');
  const contents = fs.readFileSync(appConfigPath, 'utf8');
  const data = YAML.parse(contents);
  return new ConfigReader(data);
}

describe('Config · Tech Radar · Guardrail (Static)', () => {
  describe('Required configuration constraints', () => {
    it('enforces minimal validity rules for techRadar.url', () => {
      const config = readAppConfig();
      const url = config.getString('techRadar.url');

      expect(typeof url).toBe('string');
      expect(url.trim().length).toBeGreaterThan(0);
      expect(url).toMatch(/^https:\/\//i);
      expect(url).toContain('.json');
    });
  });
});
