import pactum from 'pactum';
import dotenv from 'dotenv';
import { describe, it } from 'mocha';

dotenv.config();

const baseURL = process.env.BACKEND_BASE_URL;
const route = '/api/tech-radar/health';
const SUCCESS_STATUS_CODE = 200;

describe('API · Tech Radar · Health (Deployed)', () => {
  it(`reports service availability via GET ${route}`, async () => {
    await pactum.spec()
      .get(`${baseURL}${route}`)
      .expectStatus(SUCCESS_STATUS_CODE);
  })
})
