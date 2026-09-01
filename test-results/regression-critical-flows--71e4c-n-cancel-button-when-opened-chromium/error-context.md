# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: regression\critical-flows.spec.ts >> Regression - Critical Flows >> FASE 8: Focus Management >> Delete dialog - focus on cancel button when opened
- Location: tests\regression\critical-flows.spec.ts:83:9

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('tr:has-text("Joao Admin Atualizado")').locator('button:has-text("Excluir")')

```

# Page snapshot

```yaml
- generic [active] [ref=f2e1]:
  - button "Open Next.js Dev Tools" [ref=f2e7] [cursor=pointer]
  - alert [ref=f2e11]
  - status [ref=f2e12]:
    - generic [ref=f2e13]:
      - status [ref=f2e14]:
        - generic [ref=f2e18]: Carregando usuários...
      - paragraph [ref=f2e19]: Carregando usuários...
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | const USER_EMAIL = 'joao.admin@example.com';
  4  | const USER_PASSWORD = '123456';
  5  | const ADMIN_EMAIL = 'tentativa@example.com';
  6  | const ADMIN_PASSWORD = '123456';
  7  | 
  8  | test.describe('Regression - Critical Flows', () => {
  9  |   test.describe('FASE 7: /api/login returns user.role', () => {
  10 |     test('USER login returns role in response', async ({ page }) => {
  11 |       const response = await page.request.post('/api/login', {
  12 |         data: { email: USER_EMAIL, password: USER_PASSWORD },
  13 |       });
  14 |       expect(response.ok()).toBeTruthy();
  15 |       const data = await response.json();
  16 |       expect(data.user.role).toBe('USER');
  17 |     });
  18 | 
  19 |     test('ADMIN login returns role in response', async ({ page }) => {
  20 |       const response = await page.request.post('/api/login', {
  21 |         data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
  22 |       });
  23 |       expect(response.ok()).toBeTruthy();
  24 |       const data = await response.json();
  25 |       expect(data.user.role).toBe('ADMIN');
  26 |     });
  27 |   });
  28 | 
  29 |   test.describe('FASE 7: ADMIN gets privileges immediately after login', () => {
  30 |     test('ADMIN sees admin menu immediately after login without refresh', async ({ page }) => {
  31 |       await page.goto('/login');
  32 |       await page.fill('input[name="email"]', ADMIN_EMAIL);
  33 |       await page.fill('input[name="password"]', ADMIN_PASSWORD);
  34 |       await page.click('button[type="submit"]');
  35 |       await expect(page).toHaveURL('/dashboard');
  36 | 
  37 |       // Admin menu should be visible immediately
  38 |       await expect(page.locator('text=Administração')).toBeVisible();
  39 | 
  40 |       // Navigate to admin users - should work without manual refresh
  41 |       await page.goto('/admin/users');
  42 |       await expect(page.locator('h1:has-text("Usuários")')).toBeVisible();
  43 |     });
  44 |   });
  45 | 
  46 |   test.describe('FASE 8: Accessibility - Keyboard Navigation', () => {
  47 |     test('Login form - Tab navigation', async ({ page }) => {
  48 |       await page.goto('/login');
  49 | 
  50 |       // Tab to email
  51 |       await page.keyboard.press('Tab');
  52 |       await expect(page.locator('input[name="email"]')).toBeFocused();
  53 | 
  54 |       // Tab to password
  55 |       await page.keyboard.press('Tab');
  56 |       await expect(page.locator('input[name="password"]')).toBeFocused();
  57 | 
  58 |       // Tab to submit
  59 |       await page.keyboard.press('Tab');
  60 |       await expect(page.locator('button[type="submit"]')).toBeFocused();
  61 |     });
  62 | 
  63 |     test('Delete dialog - Escape closes dialog', async ({ page }) => {
  64 |       // Login as ADMIN
  65 |       await page.goto('/login');
  66 |       await page.fill('input[name="email"]', ADMIN_EMAIL);
  67 |       await page.fill('input[name="password"]', ADMIN_PASSWORD);
  68 |       await page.click('button[type="submit"]');
  69 |       await expect(page).toHaveURL('/dashboard');
  70 | 
  71 |       await page.goto('/admin/users');
  72 |       await page.locator('tr:has-text("Joao Admin Atualizado")').locator('button:has-text("Excluir")').click();
  73 | 
  74 |       await expect(page.locator('h2:has-text("Excluir usuário?")')).toBeVisible();
  75 | 
  76 |       // Escape should close
  77 |       await page.keyboard.press('Escape');
  78 |       await expect(page.locator('h2:has-text("Excluir usuário?")')).not.toBeVisible();
  79 |     });
  80 |   });
  81 | 
  82 |   test.describe('FASE 8: Focus Management', () => {
  83 |     test('Delete dialog - focus on cancel button when opened', async ({ page }) => {
  84 |       // Login as ADMIN
  85 |       await page.goto('/login');
  86 |       await page.fill('input[name="email"]', ADMIN_EMAIL);
  87 |       await page.fill('input[name="password"]', ADMIN_PASSWORD);
  88 |       await page.click('button[type="submit"]');
  89 |       await expect(page).toHaveURL('/dashboard');
  90 | 
  91 |       await page.goto('/admin/users');
> 92 |       await page.locator('tr:has-text("Joao Admin Atualizado")').locator('button:has-text("Excluir")').click();
     |                                                                                                        ^ Error: locator.click: Test timeout of 30000ms exceeded.
  93 | 
  94 |       // Cancel button should be focused
  95 |       await expect(page.locator('button:has-text("Cancelar")')).toBeFocused();
  96 |     });
  97 |   });
  98 | });
```