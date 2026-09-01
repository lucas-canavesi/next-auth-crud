# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin\users-list.spec.ts >> ADMIN Users List >> Access /admin/users - loads correctly
- Location: tests\admin\users-list.spec.ts:16:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('h1:has-text("Usuários")')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('h1:has-text("Usuários")')

```

```yaml
- alert
- status:
  - status: Carregando usuários...
  - paragraph: Carregando usuários...
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | const ADMIN_EMAIL = 'tentativa@example.com';
  4  | const ADMIN_PASSWORD = '123456';
  5  | 
  6  | test.describe('ADMIN Users List', () => {
  7  |   test.beforeEach(async ({ page }) => {
  8  |     // Login as ADMIN
  9  |     await page.goto('/login');
  10 |     await page.fill('input[name="email"]', ADMIN_EMAIL);
  11 |     await page.fill('input[name="password"]', ADMIN_PASSWORD);
  12 |     await page.click('button[type="submit"]');
  13 |     await expect(page).toHaveURL('/dashboard');
  14 |   });
  15 | 
  16 |   test('Access /admin/users - loads correctly', async ({ page }) => {
  17 |     await page.goto('/admin/users');
  18 | 
  19 |     // Page should load
> 20 |     await expect(page.locator('h1:has-text("Usuários")')).toBeVisible();
     |                                                           ^ Error: expect(locator).toBeVisible() failed
  21 | 
  22 |     // Users table should be visible
  23 |     await expect(page.locator('table')).toBeVisible();
  24 | 
  25 |     // Check existing users appear
  26 |     await expect(page.locator('text=Tentativa Indevida')).toBeVisible();
  27 |     await expect(page.locator('text=tentativa@example.com')).toBeVisible();
  28 |     await expect(page.locator('text=Joao Admin Atualizado')).toBeVisible();
  29 |     await expect(page.locator('text=joao.admin@example.com')).toBeVisible();
  30 |   });
  31 | 
  32 |   test('Create new user button navigates to create page', async ({ page }) => {
  33 |     await page.goto('/admin/users');
  34 |     await page.click('text=+ Novo usuário');
  35 |     await expect(page).toHaveURL('/admin/users/new');
  36 |   });
  37 | });
```