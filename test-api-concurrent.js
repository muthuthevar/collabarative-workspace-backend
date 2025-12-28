#!/usr/bin/env node

/**
 * Comprehensive API Testing Script with Concurrency
 * Tests all endpoints with multiple concurrent users
 */

const API_BASE = process.env.API_BASE || "http://localhost:3000";
const CONCURRENT_USERS = parseInt(process.env.CONCURRENT_USERS) || 5;

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  test: (msg) => console.log(`${colors.cyan}→${colors.reset} ${msg}`),
};

// Helper function to make HTTP requests
async function request(method, path, data = null, token = null) {
  const url = `${API_BASE}${path}`;
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);
  const text = await response.text();

  let json;
  try {
    json = JSON.parse(text);
  } catch (e) {
    json = { raw: text };
  }

  return {
    status: response.status,
    data: json,
    ok: response.ok,
  };
}

// Test scenarios
async function testHealthCheck() {
  log.test("Testing health check...");
  const res = await request("GET", "/health");
  if (res.ok && res.data.status === "ok") {
    log.success(`Health check passed: ${res.data.status}`);
    return true;
  }
  log.error("Health check failed");
  return false;
}

async function testMetrics() {
  log.test("Testing metrics endpoint...");
  const res = await request("GET", "/metrics");
  if (res.ok) {
    log.success("Metrics endpoint accessible");
    return true;
  }
  log.error("Metrics endpoint failed");
  return false;
}

async function registerUser(userId) {
  const email = `user${userId}@test.com`;
  const password = "SecurePass123!";
  const name = `Test User ${userId}`;

  log.test(`Registering user: ${email}`);

  const res = await request("POST", "/api/auth/register", {
    email,
    password,
    name,
    role: "OWNER",
  });

  if (res.ok && res.data.success) {
    log.success(`User registered: ${email}`);
    return {
      email,
      password,
      userId: res.data.data.user.id,
      accessToken: res.data.data.accessToken,
      refreshToken: res.data.data.refreshToken,
    };
  }

  log.error(`Failed to register user: ${email}`);
  return null;
}

async function loginUser(email, password) {
  log.test(`Logging in: ${email}`);

  const res = await request("POST", "/api/auth/login", {
    email,
    password,
  });

  if (res.ok && res.data.success) {
    log.success(`Login successful: ${email}`);
    return {
      accessToken: res.data.data.accessToken,
      refreshToken: res.data.data.refreshToken,
    };
  }

  log.error(`Login failed: ${email}`);
  return null;
}

async function validateToken(token) {
  log.test("Validating token...");

  const res = await request("GET", "/api/auth/validate", null, token);

  if (res.ok && res.data.success) {
    log.success("Token validation passed");
    return true;
  }

  log.error("Token validation failed");
  return false;
}

async function refreshToken(refreshToken) {
  log.test("Refreshing token...");

  const res = await request("POST", "/api/auth/refresh", { refreshToken });

  if (res.ok && res.data.success) {
    log.success("Token refreshed successfully");
    return res.data.data.accessToken;
  }

  log.error("Token refresh failed");
  return null;
}

async function createProject(token, projectName) {
  log.test(`Creating project: ${projectName}`);

  const res = await request(
    "POST",
    "/api/projects",
    {
      name: projectName,
      description: `Test project: ${projectName}`,
    },
    token
  );

  if (res.ok && res.data.success) {
    log.success(`Project created: ${projectName} (ID: ${res.data.data.id})`);
    return res.data.data;
  }

  log.error(`Failed to create project: ${projectName}`);
  return null;
}

async function listProjects(token) {
  log.test("Listing projects...");

  const res = await request("GET", "/api/projects", null, token);

  if (res.ok && res.data.success) {
    log.success(`Found ${res.data.data.length} projects`);
    return res.data.data;
  }

  log.error("Failed to list projects");
  return [];
}

async function getProject(token, projectId) {
  log.test(`Getting project: ${projectId}`);

  const res = await request("GET", `/api/projects/${projectId}`, null, token);

  if (res.ok && res.data.success) {
    log.success(`Retrieved project: ${res.data.data.name}`);
    return res.data.data;
  }

  log.error(`Failed to get project: ${projectId}`);
  return null;
}

async function updateProject(token, projectId, updates) {
  log.test(`Updating project: ${projectId}`);

  const res = await request(
    "PUT",
    `/api/projects/${projectId}`,
    updates,
    token
  );

  if (res.ok && res.data.success) {
    log.success(`Project updated: ${projectId}`);
    return res.data.data;
  }

  log.error(`Failed to update project: ${projectId}`);
  return null;
}

async function createWorkspace(token, projectId, workspaceName) {
  log.test(`Creating workspace: ${workspaceName}`);

  const res = await request(
    "POST",
    "/api/workspaces",
    {
      projectId,
      name: workspaceName,
      type: "DOCUMENT",
    },
    token
  );

  if (res.ok && res.data.success) {
    log.success(`Workspace created: ${workspaceName}`);
    return res.data.data;
  }

  log.error(`Failed to create workspace: ${workspaceName}`);
  return null;
}

async function submitJob(token, jobType) {
  log.test(`Submitting job: ${jobType}`);

  const res = await request(
    "POST",
    "/api/jobs",
    {
      type: jobType,
      payload: { test: true },
    },
    token
  );

  if (res.ok && res.data.success) {
    log.success(`Job submitted: ${jobType} (ID: ${res.data.data.id})`);
    return res.data.data;
  }

  log.error(`Failed to submit job: ${jobType}`);
  return null;
}

async function getJobStatus(token, jobId) {
  log.test(`Getting job status: ${jobId}`);

  const res = await request("GET", `/api/jobs/${jobId}`, null, token);

  if (res.ok && res.data.success) {
    log.success(`Job status: ${res.data.data.status}`);
    return res.data.data;
  }

  log.error(`Failed to get job status: ${jobId}`);
  return null;
}

// Run tests for a single user
async function runUserTests(userId) {
  console.log(
    `\n${colors.yellow}=== User ${userId} Test Suite ===${colors.reset}\n`
  );

  const results = {
    userId,
    passed: 0,
    failed: 0,
    tests: [],
  };

  try {
    // Register
    const user = await registerUser(userId);
    if (!user) {
      results.failed++;
      return results;
    }
    results.passed++;

    // Login
    const loginData = await loginUser(user.email, user.password);
    if (!loginData) {
      results.failed++;
      return results;
    }
    results.passed++;

    // Validate token
    if (await validateToken(user.accessToken)) {
      results.passed++;
    } else {
      results.failed++;
    }

    // Create project
    const project = await createProject(
      user.accessToken,
      `Project-User${userId}`
    );
    if (!project) {
      results.failed++;
      return results;
    }
    results.passed++;

    // List projects
    const projects = await listProjects(user.accessToken);
    if (projects.length > 0) {
      results.passed++;
    } else {
      results.failed++;
    }

    // Get project
    if (await getProject(user.accessToken, project.id)) {
      results.passed++;
    } else {
      results.failed++;
    }

    // Update project
    if (
      await updateProject(user.accessToken, project.id, {
        name: `Updated-Project-User${userId}`,
        description: "Updated description",
      })
    ) {
      results.passed++;
    } else {
      results.failed++;
    }

    // Create workspace
    if (
      await createWorkspace(
        user.accessToken,
        project.id,
        `Workspace-User${userId}`
      )
    ) {
      results.passed++;
    } else {
      results.failed++;
    }

    // Submit job
    const job = await submitJob(user.accessToken, "EXPORT");
    if (job) {
      results.passed++;

      // Get job status
      if (await getJobStatus(user.accessToken, job.id)) {
        results.passed++;
      } else {
        results.failed++;
      }
    } else {
      results.failed += 2;
    }

    // Refresh token
    if (await refreshToken(user.refreshToken)) {
      results.passed++;
    } else {
      results.failed++;
    }
  } catch (error) {
    log.error(`User ${userId} tests failed with error: ${error.message}`);
    results.failed++;
  }

  return results;
}

// Main test runner
async function main() {
  console.log(
    `\n${colors.cyan}╔═══════════════════════════════════════════════╗${colors.reset}`
  );
  console.log(
    `${colors.cyan}║   Collaborative Workspace API Test Suite     ║${colors.reset}`
  );
  console.log(
    `${colors.cyan}╚═══════════════════════════════════════════════╝${colors.reset}\n`
  );

  log.info(`API Base: ${API_BASE}`);
  log.info(`Concurrent Users: ${CONCURRENT_USERS}`);
  console.log("");

  // Test system endpoints
  console.log(`${colors.yellow}=== System Tests ===${colors.reset}\n`);
  await testHealthCheck();
  await testMetrics();

  // Run concurrent user tests
  console.log(
    `\n${colors.yellow}=== Concurrent User Tests ===${colors.reset}\n`
  );
  log.info(`Starting ${CONCURRENT_USERS} concurrent user test suites...`);

  const startTime = Date.now();

  const userTests = [];
  for (let i = 1; i <= CONCURRENT_USERS; i++) {
    userTests.push(runUserTests(i));
  }

  const results = await Promise.all(userTests);

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  // Summary
  console.log(
    `\n${colors.cyan}╔═══════════════════════════════════════════════╗${colors.reset}`
  );
  console.log(
    `${colors.cyan}║              Test Results Summary             ║${colors.reset}`
  );
  console.log(
    `${colors.cyan}╚═══════════════════════════════════════════════╝${colors.reset}\n`
  );

  let totalPassed = 0;
  let totalFailed = 0;

  results.forEach((result) => {
    totalPassed += result.passed;
    totalFailed += result.failed;
    console.log(
      `User ${result.userId}: ${colors.green}${result.passed} passed${colors.reset}, ${colors.red}${result.failed} failed${colors.reset}`
    );
  });

  console.log(
    `\n${colors.cyan}Total Tests:${colors.reset} ${totalPassed + totalFailed}`
  );
  console.log(`${colors.green}Passed:${colors.reset} ${totalPassed}`);
  console.log(`${colors.red}Failed:${colors.reset} ${totalFailed}`);
  console.log(`${colors.yellow}Duration:${colors.reset} ${duration}s`);
  console.log(
    `${colors.yellow}Success Rate:${colors.reset} ${(
      (totalPassed / (totalPassed + totalFailed)) *
      100
    ).toFixed(2)}%\n`
  );

  process.exit(totalFailed > 0 ? 1 : 0);
}

// Run if executed directly
if (require.main === module) {
  main().catch((error) => {
    log.error(`Test suite failed: ${error.message}`);
    console.error(error);
    process.exit(1);
  });
}

module.exports = { request, runUserTests };
