import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 }, // Rampa de subida para 20 usuários
    { duration: '1m', target: 50 },  // Aumenta para 50 usuários
    { duration: '2m', target: 100 }, // Pico de 100 usuários
    { duration: '1m', target: 0 },   // Rampa de descida
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% das requisições devem completar em 2s
    http_req_failed: ['rate<0.01'],      // Menos de 1% de falhas
  },
};

const BASE_URL = 'https://architecture-survey.vercel.app';

function generateRandomEmail() {
  return `user${Date.now()}${Math.floor(Math.random() * 10000)}@test.com`;
}

function generateRandomSurveyResponses() {
  return {
    period: Math.floor(Math.random() * 2) + 1, // 1 ou 2
    responses: Array(10).fill(0).map(() => Math.floor(Math.random() * 5) + 1) // 10 respostas entre 1-5
  };
}

export default function () {
  const email = generateRandomEmail();
  
  // 1. Verificar email
  let checkResponse = http.post(`${BASE_URL}/api/check-email`, JSON.stringify({ email }), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  check(checkResponse, {
    'email check status is 200': (r) => r.status === 200,
    'email is available': (r) => !JSON.parse(r.body).isUsed,
  });
  
  sleep(1);
  
  // 2. Registrar email
  let registerResponse = http.post(`${BASE_URL}/api/register-email`, JSON.stringify({ email }), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  check(registerResponse, {
    'email register status is 200': (r) => r.status === 200,
    'email registered successfully': (r) => JSON.parse(r.body).success === true,
  });
  
  sleep(2);
  
  // 3. Submeter respostas da pesquisa
  const surveyData = generateRandomSurveyResponses();
  let submitResponse = http.post(`${BASE_URL}/api/submit-survey`, JSON.stringify(surveyData), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  check(submitResponse, {
    'survey submit status is 200': (r) => r.status === 200,
    'survey submitted successfully': (r) => JSON.parse(r.body).success === true,
  });
  
  sleep(3);
}