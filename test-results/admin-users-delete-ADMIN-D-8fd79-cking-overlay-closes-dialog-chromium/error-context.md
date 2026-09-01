# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin\users-delete.spec.ts >> ADMIN Delete User >> Delete user - clicking overlay closes dialog
- Location: tests\admin\users-delete.spec.ts:62:7

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
  3  | const ADMIN_EMAIL = 'tentativa@example.com';
  4  | const ADMIN_PASSWORD = '123456';
  5  | 
  6  | test.describe('ADMIN Delete User', () => {
  7  |   test.beforeEach(async ({ page }) => {
  8  |     // Login as ADMIN
  9  |     await page.goto('/login');
  10 |     await page.fill('input[name="email"]', ADMIN_EMAIL);
  11 |     await page.fill('input[name="password"]', ADMIN_PASSWORD);
  12 |     await page.click('button[type="submit"]');
  13 |     await expect(page).toHaveURL('/dashboard');
  14 |   });
  15 | 
  16 |   test('Delete user - confirm deletion', async ({ page }) => {
  17 |     await page.goto('/admin/users');
  18 | 
  19 |     // Get initial user count
  20 |     const initialRows = await page.locator('tbody tr').count();
  21 | 
  22 |     // Click delete on the test user (not the current admin)
  23 |     await page.locator('tr:has-text("Joao Admin Atualizado")').locator('button:has-text("Excluir")').click();
  24 | 
  25 |     // Dialog should appear
  26 |     await expect(page.locator('h2:has-text("Excluir usuário?")')).toBeVisible();
  27 | 
  28 |     // Cancel should close dialog
  29 |     await page.click('button:has-text("Cancelar")');
  30 |     await expect(page.locator('h2:has-text("Excluir usuário?")')).not.toBeVisible();
  31 | 
  32 |     // Click delete again
  33 |     await page.locator('tr:has-text("Joao Admin Atualizado")').locator('button:has-text("Excluir")').click();
  34 | 
  35 |     // Confirm deletion
  36 |     await page.click('button:has-text("Excluir"):not(:has-text("Cancelar"))');
  37 | 
  38 |     // User should be removed from list
  39 |     await expect(page.locator('text=Joao Admin Atualizado')).not.toBeVisible();
  40 | 
  41 |     // Row count should decrease
  42 |     const finalRows = await page.locator('tbody tr').count();
  43 |     expect(finalRows).toBe(initialRows - 1);
  44 |   });
  45 | 
  46 |   test('Delete user - Escape key closes dialog', async ({ page }) => {
  47 |     await page.goto('/admin/users');
  48 | 
  49 |     // Click delete
  50 |     await page.locator('tr:has-text("Joao Admin Atualizado")').locator('button:has-text("Excluir")').click();
  51 | 
  52 |     // Dialog should appear
  53 |     await expect(page.locator('h2:has-text("Excluir usuário?")')).toBeVisible();
  54 | 
  55 |     // Press Escape
  56 |     await page.keyboard.press('Escape');
  57 | 
  58 |     // Dialog should close
  59 |     await expect(page.locator('h2:has-text("Excluir usuário?")')).not.toBeVisible();
  60 |   });
  61 | 
  62 |   test('Delete user - clicking overlay closes dialog', async ({ page }) => {
  63 |     await page.goto('/admin/users');
  64 | 
  65 |     // Click delete
> 66 |     await page.locator('tr:has-text("Joao Admin Atualizado")').locator('button:has-text("Excluir")').click();
     |                                                                                                      ^ Error: locator.click: Test timeout of 30000ms exceeded.
  67 | 
  68 |     // Dialog should appear
  69 |     await expect(page.locator('h2:has-text("Excluir usuário?")')).toBeVisible();
  70 | 
  71 |     // Click overlay (background)
  72 |     await page.locator('.fixed.inset-0.bg-black\\/50').click();
  73 | 
  74 |     // Dialog should close
  75 |     await expect(page.locator('h2:has-text("Excluir usuário?")')).not.toBeVisible();
  76 |   });
  77 | });
```