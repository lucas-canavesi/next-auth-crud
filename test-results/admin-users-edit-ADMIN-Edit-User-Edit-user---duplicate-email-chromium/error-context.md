# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin\users-edit.spec.ts >> ADMIN Edit User >> Edit user - duplicate email
- Location: tests\admin\users-edit.spec.ts:51:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('tr:has-text("Joao Admin Atualizado")').locator('a:has-text("Editar")')

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
  6  | test.describe('ADMIN Edit User', () => {
  7  |   test.beforeEach(async ({ page }) => {
  8  |     // Login as ADMIN
  9  |     await page.goto('/login');
  10 |     await page.fill('input[name="email"]', ADMIN_EMAIL);
  11 |     await page.fill('input[name="password"]', ADMIN_PASSWORD);
  12 |     await page.click('button[type="submit"]');
  13 |     await expect(page).toHaveURL('/dashboard');
  14 |   });
  15 | 
  16 |   test('Edit user - valid changes', async ({ page }) => {
  17 |     await page.goto('/admin/users');
  18 | 
  19 |     // Click edit on the test user
  20 |     await page.locator('tr:has-text("Joao Admin Atualizado")').locator('a:has-text("Editar")').click();
  21 | 
  22 |     // Should navigate to edit page
  23 |     await expect(page).toHaveURL(/\/admin\/users\/\d+\/edit/);
  24 | 
  25 |     // Form should have current data
  26 |     await expect(page.locator('input[name="name"]')).toHaveValue('Joao Admin Atualizado');
  27 |     await expect(page.locator('input[name="email"]')).toHaveValue('joao.admin@example.com');
  28 | 
  29 |     // Update name
  30 |     await page.fill('input[name="name"]', 'Joao Editado E2E');
  31 |     await page.click('button:has-text("Salvar alterações")');
  32 | 
  33 |     // Should redirect to users list
  34 |     await expect(page).toHaveURL('/admin/users');
  35 | 
  36 |     // Updated name should appear
  37 |     await expect(page.locator('text=Joao Editado E2E')).toBeVisible();
  38 |   });
  39 | 
  40 |   test('Edit user - empty name', async ({ page }) => {
  41 |     await page.goto('/admin/users');
  42 |     await page.locator('tr:has-text("Joao Admin Atualizado")').locator('a:has-text("Editar")').click();
  43 | 
  44 |     await page.fill('input[name="name"]', '');
  45 |     await page.click('button:has-text("Salvar alterações")');
  46 | 
  47 |     // Error should appear
  48 |     await expect(page.locator('text=Nome é obrigatório')).toBeVisible();
  49 |   });
  50 | 
  51 |   test('Edit user - duplicate email', async ({ page }) => {
  52 |     await page.goto('/admin/users');
> 53 |     await page.locator('tr:has-text("Joao Admin Atualizado")').locator('a:has-text("Editar")').click();
     |                                                                                                ^ Error: locator.click: Test timeout of 30000ms exceeded.
  54 | 
  55 |     await page.fill('input[name="email"]', 'tentativa@example.com');
  56 |     await page.click('button:has-text("Salvar alterações")');
  57 | 
  58 |     // Error should appear
  59 |     await expect(page.locator('text=Este email já está cadastrado')).toBeVisible();
  60 |   });
  61 | 
  62 |   test('Edit user - non-existent user', async ({ page }) => {
  63 |     await page.goto('/admin/users/99999/edit');
  64 | 
  65 |     // Should redirect to users list with error
  66 |     await expect(page).toHaveURL('/admin/users');
  67 |     await expect(page.locator('text=Usuário não encontrado')).toBeVisible();
  68 |   });
  69 | });
```