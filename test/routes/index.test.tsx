import { test, expect } from '../../setup'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('has the right title', async ({ page }) => {
  await expect(page.locator('.hero .title')).toHaveText('Cosmic Jazz Stack')
})

test('has join button', async ({ page }) => {
  const join = page.locator('.hero .button', {
    hasText: 'Sign up'
  })
  await join.click()
  await expect(page.url()).toMatch(/\/join$/)
})

test('has login button', async ({ page }) => {
  const login = page.locator('.hero .button', {
    hasText: 'Log In'
  })
  await login.click()
  await expect(page.url()).toMatch(/\/login$/)
})
