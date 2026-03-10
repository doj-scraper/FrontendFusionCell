import { expect, test } from '@playwright/test'

test('homepage renders core navigation', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/FusionCell/i)
})
