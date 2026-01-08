
import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
import { ConfigReader } from '@backstage/config';
import { mockServices, startTestBackend } from '@backstage/backend-test-utils';
import techRadarBackendFeature from '@backstage-community/plugin-tech-radar-backend';

type StartedBackend = Awaited<ReturnType<typeof startTestBackend>>;

function readAppConfig(): ConfigReader {
  const appConfigPath = path.resolve(__dirname, '../../../../../../app-config.yaml');
  const contents = fs.readFileSync(appConfigPath, 'utf8');
  const data = YAML.parse(contents);
  return new ConfigReader(data);
}

describe('Tech Radar Backend · Integration', () => {
  describe('Configuration contract · Guard-rail', () => {
    it('validates configuration contract', () => {
      const config = readAppConfig();
      const url = config.getString('techRadar.url');

      expect(typeof url).toBe('string');
      expect(url.trim().length).toBeGreaterThan(0);
      expect(url).toMatch(/^https:\/\//i);
      expect(url).toContain('.json');
    });
  });

  describe('Runtime behavior · In-process backend', () => {
    let baseUrl: string;
    let server: StartedBackend['server'];
    let urlReader: ReturnType<typeof mockServices.urlReader.mock>;
    const configData = {
      techRadar: {
        url: 'https://fake-app-config.simulation.test/tech-radar.json',
      },
    };

    beforeAll(async () => {
      urlReader = mockServices.urlReader.mock({
        readUrl: jest.fn(async () => ({
          buffer: async () =>
            Buffer.from(JSON.stringify({ entries: [], quadrants: [], rings: [] }), 'utf8'),
          etag: 'fake-etag',
        })),
      });

      const started = await startTestBackend({
        features: [
          techRadarBackendFeature,
          mockServices.rootConfig.factory({ data: configData }),
          urlReader.factory,
        ],
      });

      server = started.server;

      const port = server.port();
      baseUrl = `http://127.0.0.1:${port}`;
    });

    afterAll(async () => {
      if (server?.stop) {
        await server.stop();
      }
    });

    it('serves radar data from the configured source', async () => {
      const res = await fetch(`${baseUrl}/api/tech-radar/data`);
      const body = await res.text();

      expect(res.status).toBe(200);
      expect(urlReader.readUrl).toHaveBeenCalled();
      expect(body).toEqual('{"quadrants":[],"rings":[],"entries":[]}')
    });
  })
});
