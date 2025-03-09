import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data'; //to load test data

// Load users from external JSON file
const users = new SharedArray('users', function () {
  return JSON.parse(open('./users.json')); 
});

export let options = {
  scenarios: {
    constant_arrival: {
      executor: "constant-arrival-rate",
      rate: 10, // 10 requests per second
      timeUnit: "1s",
      duration: "2s", // Test for 1 minute
      preAllocatedVUs: 50,
      maxVUs: 100, // constant max user
    },
  },
  thresholds: {
    http_req_duration: ["p(95)<8000"], // 95% of requests must be complete under 8 seconds
    http_req_failed: ["rate<0.01"], // Error rate should be <1%
    http_reqs: ["rate<100"], // total request should be
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

  check(res, {
    '✅ Status is 200 for valid credentials': (r) => r.status === 200,
    '⏱️ Response time <8000ms': (r) => r.timings.duration < 8000, 
  });

  sleep(0.5);  // Shortened wait time
}
