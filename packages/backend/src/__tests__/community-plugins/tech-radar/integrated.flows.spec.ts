import pactum from 'pactum';
import dotenv from 'dotenv';
import { describe, it } from 'mocha';
import assert from 'node:assert/strict';

dotenv.config();

const baseURL = process.env.BACKEND_BASE_URL;
const automationBearerToken = process.env.BACKEND_TEST_BEARER_TOKEN;
const route = '/api/tech-radar/data';
const HTTP_OK = 200;
const HTTP_NOT_MODIFIED = 304;
const HTTP_UNAUTHORIZED = 401;

function radarRequestWithAuth() {
  return pactum.spec()
    .get(`${baseURL}${route}`)
    .withBearerToken(String(automationBearerToken));
}

describe('Tech Radar API · Integrated Flows', () => {
  it('serves radar data for authenticated requests', async () => {
    await radarRequestWithAuth()
      .expectStatus(HTTP_OK)
      .expect((ctx) => {
        const body = ctx.res.body;
        assert.equal(typeof body, 'object');
        assert.ok(Array.isArray(body.quadrants));
        assert.ok(Array.isArray(body.rings));
        assert.ok(Array.isArray(body.entries));
        assert.equal(body.quadrants.length, 4);
      })
  })

  it('supports conditional requests using ETag caching', async () => {
    const etag = await radarRequestWithAuth()
      .expectHeaderContains('etag', 'W/"')
      .returns((ctx) => ctx.res.headers['etag']);

    await pactum.spec()
      .get(`${baseURL}${route}`)
      .withBearerToken(String(automationBearerToken))
      .withHeaders('If-None-Match', etag)
      .expectStatus(HTTP_NOT_MODIFIED);
  })

  it('rejects unauthenticated requests', async () => {
    await pactum.spec()
      .get(`${baseURL}${route}`)
      .expectStatus(HTTP_UNAUTHORIZED);
  })
})
