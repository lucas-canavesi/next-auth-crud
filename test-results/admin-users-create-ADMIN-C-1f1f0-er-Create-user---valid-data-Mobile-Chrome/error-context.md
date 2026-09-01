# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin\users-create.spec.ts >> ADMIN Create User >> Create user - valid data
- Location: tests\admin\users-create.spec.ts:16:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected: "http://localhost:3000/admin/users"
Received: "http://localhost:3000/admin/users/new"
Timeout:  5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    14 × locator resolved to <html lang="pt-BR" class="geist_a71539c9-module__T19VSG__variable geist_mono_8d43a2aa-module__8Li5zG__variable h-full antialiased">…</html>
       - unexpected value "http://localhost:3000/admin/users/new"

```

```yaml
- alert
- heading "Novo Usuário" [level=1]
- paragraph: Preencha os dados para criar um novo usuário.
- alert:
  - heading "Erro" [level=4]
  - paragraph: Este email já está cadastrado.
  - button "Dispensar"
- heading "Dados do Usuário" [level=3]
- paragraph: Preencha os campos para criar um novo usuário.
- text: Nome
- textbox "Nome": E2E Test User
- text: Email
- textbox "Email": e2e.user@example.com
- text: Senha
- textbox "Senha": "12345678"
- paragraph: Mínimo 6 caracteres
- button "Criar usuário"
- button "Cancelar"
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | const ADMIN_EMAIL = 'tentativa@example.com';
  4  | const ADMIN_PASSWORD = '123456';
  5  | 
  6  | test.describe('ADMIN Create User', () => {
  7  |   test.beforeEach(async ({ page }) => {
  8  |     // Login as ADMIN
  9  |     await page.goto('/login');
  10 |     await page.fill('input[name="email"]', ADMIN_EMAIL);
  11 |     await page.fill('input[name="password"]', ADMIN_PASSWORD);
  12 |     await page.click('button[type="submit"]');
  13 |     await expect(page).toHaveURL('/dashboard');
  14 |   });
  15 | 
  16 |   test('Create user - valid data', async ({ page }) => {
  17 |     await page.goto('/admin/users/new');
  18 | 
  19 |     // Page should load
  20 |     await expect(page.locator('h1:has-text("Novo Usuário")')).toBeVisible();
  21 | 
  22 |     // Fill form
  23 |     await page.fill('input[name="name"]', 'E2E Test User');
  24 |     await page.fill('input[name="email"]', 'e2e.user@example.com');
  25 |     await page.fill('input[name="password"]', '12345678');
  26 | 
  27 |     // Submit
  28 |     await page.click('button:has-text("Criar usuário")');
  29 | 
  30 |     // Should redirect to users list
> 31 |     await expect(page).toHaveURL('/admin/users');
     |                        ^ Error: expect(page).toHaveURL(expected) failed
  32 | 
  33 |     // New user should appear in list
  34 |     await expect(page.locator('text=E2E Test User')).toBeVisible();
  35 |     await expect(page.locator('text=e2e.user@example.com')).toBeVisible();
  36 |   });
  37 | 
  38 |   test('Create user - empty name', async ({ page }) => {
  39 |     await page.goto('/admin/users/new');
  40 | 
  41 |     await page.fill('input[name="email"]', 'test@example.com');
  42 |     await page.fill('input[name="password"]', '12345678');
  43 |     await page.click('button:has-text("Criar usuário")');
  44 | 
  45 |     // Error should appear
  46 |     await expect(page.locator('text=Nome é obrigatório')).toBeVisible();
  47 |   });
  48 | 
  49 |   test('Create user - name too short', async ({ page }) => {
  50 |     await page.goto('/admin/users/new');
  51 | 
  52 |     await page.fill('input[name="name"]', 'J');
  53 |     await page.fill('input[name="email"]', 'test@example.com');
  54 |     await page.fill('input[name="password"]', '12345678');
  55 |     await page.click('button:has-text("Criar usuário")');
  56 | 
  57 |     // Error should appear
  58 |     await expect(page.locator('text=Nome deve ter pelo menos 2 caracteres')).toBeVisible();
  59 |   });
  60 | 
  61 |   test('Create user - invalid email', async ({ page }) => {
  62 |     await page.goto('/admin/users/new');
  63 | 
  64 |     await page.fill('input[name="name"]', 'Test User');
  65 |     await page.fill('input[name="email"]', 'invalid-email');
  66 |     await page.fill('input[name="password"]', '12345678');
  67 |     await page.click('button:has-text("Criar usuário")');
  68 | 
  69 |     // Error should appear
  70 |     await expect(page.locator('text=Email inválido')).toBeVisible();
  71 |   });
  72 | 
  73 |   test('Create user - password too short', async ({ page }) => {
  74 |     await page.goto('/admin/users/new');
  75 | 
  76 |     await page.fill('input[name="name"]', 'Test User');
  77 |     await page.fill('input[name="email"]', 'test@example.com');
  78 |     await page.fill('input[name="password"]', '123');
  79 |     await page.click('button:has-text("Criar usuário")');
  80 | 
  81 |     // Error should appear
  82 |     await expect(page.locator('text=Senha deve ter pelo menos 6 caracteres')).toBeVisible();
  83 |   });
  84 | 
  85 |   test('Create user - duplicate email', async ({ page }) => {
  86 |     await page.goto('/admin/users/new');
  87 | 
  88 |     // Use existing email
  89 |     await page.fill('input[name="name"]', 'Another User');
  90 |     await page.fill('input[name="email"]', 'tentativa@example.com');
  91 |     await page.fill('input[name="password"]', '12345678');
  92 |     await page.click('button:has-text("Criar usuário")');
  93 | 
  94 |     // Error should appear
  95 |     await expect(page.locator('text=Este email já está cadastrado')).toBeVisible();
  96 |   });
  97 | });
```