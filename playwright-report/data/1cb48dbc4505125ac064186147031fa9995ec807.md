# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: user\authorization.spec.ts >> Frontend Authorization - USER blocked from ADMIN routes >> USER accessing /admin/users redirects to /dashboard
- Location: tests\user\authorization.spec.ts:16:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected: "http://localhost:3000/dashboard"
Received: "http://localhost:3000/admin/users"
Timeout:  5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    14 × locator resolved to <html lang="pt-BR" class="geist_a71539c9-module__T19VSG__variable geist_mono_8d43a2aa-module__8Li5zG__variable h-full antialiased">…</html>
       - unexpected value "http://localhost:3000/admin/users"

```

```yaml
- heading "Acesso Negado" [level=1]
- paragraph: Você não tem permissão para acessar esta área.
- alert
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | const USER_EMAIL = 'joao.admin@example.com';
  4  | const USER_PASSWORD = '123456';
  5  | 
  6  | test.describe('Frontend Authorization - USER blocked from ADMIN routes', () => {
  7  |   test.beforeEach(async ({ page }) => {
  8  |     // Login as USER
  9  |     await page.goto('/login');
  10 |     await page.fill('input[name="email"]', USER_EMAIL);
  11 |     await page.fill('input[name="password"]', USER_PASSWORD);
  12 |     await page.click('button[type="submit"]');
  13 |     await expect(page).toHaveURL('/dashboard');
  14 |   });
  15 | 
  16 |   test('USER accessing /admin/users redirects to /dashboard', async ({ page }) => {
  17 |     await page.goto('/admin/users');
  18 |     // Should be redirected to dashboard (or login) by AdminGuard
> 19 |     await expect(page).toHaveURL('/dashboard');
     |                        ^ Error: expect(page).toHaveURL(expected) failed
  20 |   });
  21 | 
  22 |   test('USER accessing /admin/users/new redirects to /dashboard', async ({ page }) => {
  23 |     await page.goto('/admin/users/new');
  24 |     await expect(page).toHaveURL('/dashboard');
  25 |   });
  26 | 
  27 |   test('USER accessing /admin/users/1/edit redirects to /dashboard', async ({ page }) => {
  28 |     await page.goto('/admin/users/1/edit');
  29 |     await expect(page).toHaveURL('/dashboard');
  30 |   });
  31 | 
  32 |   test('USER does not see Administração menu', async ({ page }) => {
  33 |     await expect(page.locator('text=Administração')).not.toBeVisible();
  34 |   });
  35 | });
```