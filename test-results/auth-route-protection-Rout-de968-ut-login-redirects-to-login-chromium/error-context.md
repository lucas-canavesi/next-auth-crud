# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth\route-protection.spec.ts >> Route Protection - Unauthenticated User >> Access /dashboard without login redirects to /login
- Location: tests\auth\route-protection.spec.ts:8:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected: "http://localhost:3000/login"
Received: "http://localhost:3000/dashboard"
Timeout:  5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    14 × locator resolved to <html lang="pt-BR" class="geist_a71539c9-module__T19VSG__variable geist_mono_8d43a2aa-module__8Li5zG__variable h-full antialiased">…</html>
       - unexpected value "http://localhost:3000/dashboard"

```

```yaml
- heading "404" [level=1]
- heading "This page could not be found." [level=2]
- alert
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Route Protection - Unauthenticated User', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.context().clearCookies();
  6  |   });
  7  | 
  8  |   test('Access /dashboard without login redirects to /login', async ({ page }) => {
  9  |     await page.goto('/dashboard');
> 10 |     await expect(page).toHaveURL('/login');
     |                        ^ Error: expect(page).toHaveURL(expected) failed
  11 |   });
  12 | 
  13 |   test('Access /admin/users without login redirects to /login', async ({ page }) => {
  14 |     await page.goto('/admin/users');
  15 |     await expect(page).toHaveURL('/login');
  16 |   });
  17 | 
  18 |   test('Access /admin/users/new without login redirects to /login', async ({ page }) => {
  19 |     await page.goto('/admin/users/new');
  20 |     await expect(page).toHaveURL('/login');
  21 |   });
  22 | 
  23 |   test('Access /dashboard/profile without login redirects to /login', async ({ page }) => {
  24 |     await page.goto('/dashboard/profile');
  25 |     await expect(page).toHaveURL('/login');
  26 |   });
  27 | });
```