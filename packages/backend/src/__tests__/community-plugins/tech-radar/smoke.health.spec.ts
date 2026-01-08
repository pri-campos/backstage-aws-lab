import pactum from 'pactum';
import dotenv from 'dotenv';
import { describe, it } from 'mocha';

dotenv.config();

const baseURL = process.env.BACKEND_BASE_URL;
const route = '/api/tech-radar/health';
const SUCCESS_STATUS_CODE = 200;

describe('Tech Radar API · Health Smoke', () => {
  it(`returns ${SUCCESS_STATUS_CODE} when GET ${route} is called`, async () => {
    await pactum.spec()
      .get(`${baseURL}${route}`)
      .expectStatus(SUCCESS_STATUS_CODE);
  })
})
