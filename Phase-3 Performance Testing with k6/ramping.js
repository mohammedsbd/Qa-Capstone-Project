import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';

// Load users from external JSON file
const users = new SharedArray('users', function () {
  return JSON.parse(open('./users.json')); 
});

export let options = {
  scenarios: {
    ramping_arrival: {
      executor: "ramping-arrival-rate",
      startRate: 5, // Start with 5 requests/sec
      timeUnit: "1s",
      preAllocatedVUs: 50,
      maxVUs: 100,//varying user not constant
      stages: [
        { duration: "2s", target: 20 },
        { duration: "3s", target: 50 },
        { duration: "1s", target: 0 },
      ],
    },
  },
  thresholds: {
    http_req_duration: ["p(95)<8000"], // 95% requests < 8000ms
    http_req_failed: ["rate<0.01"], // Failure rate < 1%
    http_reqs: ["rate<100"],//pers second 100 users access the website
  },
  cloud: {
    // Project: Default project
    projectID: 3753016,
    // Test runs with the same name groups test runs together.
    name: "capstonetest",
  },
};

export default function () {
  let user = users[Math.floor(Math.random() * users.length)];

  let payload = JSON.stringify({
    username: user.username,
    password: user.password,
  });

  let params = {
    headers: { 'Content-Type': 'application/json' },
  };

  let res = http.post('https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate', payload, params);

  // Check if the response is valid and status is 200
  check(res, {
    '✅ Status is 200 for valid credentials': (r) => r.status === 200,
    '⏱️ Response time < 8000ms': (r) => r.timings.duration < 8000,
  });

  // Error handling for when the response body is invalid
  if (res.status !== 200 || !res.body) {
    console.error('Request failed or response body is empty');
  }

  sleep(1);
}
