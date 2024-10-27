import {test, expect} from '@playwright/test';
import {getRandomNumber} from './../utils/helper';

test('has title', async ({page}) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/TYPO3 ToDo List/);
});

test('can create a task', async ({page}) => {
    await page.goto('/');
    await page.click('button.add-task');
    await expect(page.locator('button[type="submit"]')).toHaveText(/Save/);

    const title = '[Frontend] New task ' + getRandomNumber(1, 1000);

    await page.fill('input[name="title"]', title);
    await page.fill('textarea[name="description"]', 'This task was automatically created by a frontend test');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=' + title)).toHaveText(title);
    await expect(page.locator('.snackbar')).toHaveText(/New task created/, { timeout: 5000 });
});

test('can list all tasks', async ({page}) => {
    await page.goto('/');
    await expect(await page.locator(".task-item").count()).toBeGreaterThan(0);
});

test('can edit a task', async ({page}) => {
    await page.goto('/');
    await page.click('button.edit-task');
    await expect(page.locator('button[type="submit"]')).toHaveText(/Save/);

    const title = '[Frontend] ' + await page.locator('input[name="title"]').inputValue() + ' - updated';
    await page.fill('input[name="title"]', title);

    await page.click('button[type="submit"]');
    await expect(page.locator('.snackbar')).toHaveText(/Task updated/, { timeout: 5000 });
});

test('can delete a task', async ({page}) => {
    await page.goto('/');
    await page.click('button.delete-task');
    await expect(page.locator('.snackbar')).toHaveText(/Task deleted/, { timeout: 5000 });
});
