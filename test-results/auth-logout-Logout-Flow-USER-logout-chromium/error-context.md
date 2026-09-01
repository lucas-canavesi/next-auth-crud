# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth\logout.spec.ts >> Logout Flow >> USER logout
- Location: tests\auth\logout.spec.ts:7:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('button:has-text("Sair")')

```

# Page snapshot

```yaml
- generic [active] [ref=f1e1]:
  - generic [ref=f1e3]:
    - heading "404" [level=1] [ref=f1e4]
    - heading "This page could not be found." [level=2] [ref=f1e6]
  - button "Open Next.js Dev Tools" [ref=f1e12] [cursor=pointer]
  - alert [ref=f1e16]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | const USER_EMAIL = 'joao.admin@example.com';
  4  | const USER_PASSWORD = '123456';
  5  | 
  6  | test.describe('Logout Flow', () => {
  7  |   test('USER logout', async ({ page }) => {
  8  |     // Login first
  9  |     await page.goto('/login');
  10 |     await page.fill('input[name="email"]', USER_EMAIL);
  11 |     await page.fill('input[name="password"]', USER_PASSWORD);
  12 |     await page.click('button[type="submit"]');
  13 |     await expect(page).toHaveURL('/dashboard');
  14 | 
  15 |     // Click logout
> 16 |     await page.click('button:has-text("Sair")');
     |                ^ Error: page.click: Test timeout of 30000ms exceeded.
  17 | 
  18 |     // Should redirect to login
  19 |     await expect(page).toHaveURL('/login');
  20 | 
  21 |     // Try to access protected page - should redirect to login
  22 |     await page.goto('/dashboard');
  23 |     await expect(page).toHaveURL('/login');
  24 | 
  25 |     // Try to access admin page - should redirect to login
  26 |     await page.goto('/admin/users');
  27 |     await expect(page).toHaveURL('/login');
  28 |   });
  29 | });
```