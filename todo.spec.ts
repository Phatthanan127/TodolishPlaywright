import { test, expect } from '@playwright/test';

test.describe('To-Do List Website Automation', () => {
  const url = 'https://abhigyank.github.io/To-Do-List/';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
    // Clear local storage before each test
    await page.evaluate(() => {
      localStorage.clear();
    });
    await page.reload();
  });

  test('load the page and check title', async ({ page }) => {
    await expect(page).toHaveURL(url);
    const title = await page.title();
    expect(title).toBe('To-Do List');
  });

  test('show the header and Tab item', async ({ page }) => {
    const header = page.locator('h1');
    const AddItem = page.locator('a[href="#add-item"]');
    const todoTab = page.locator('a[href="#todo"]');
    const completedTab = page.locator('a[href="#completed"]');
    await expect(header).toBeVisible();
    await expect(header).toHaveText('To Do List');
    await expect(AddItem).toBeVisible();
    await expect(AddItem).toHaveText('Add Item');
    await expect(todoTab).toBeVisible();
    await expect(todoTab).toHaveText('To-Do Tasks');
    await expect(completedTab).toBeVisible();
    await expect(completedTab).toHaveText('Completed');

  });

  test('show no tasks on initial load', async ({ page }) => {
    const tasks = await page.locator('#incomplete-tasks li');
    await expect(tasks).toHaveCount(0);
  });

  test('add a new task', async ({ page }) => {
    await page.locator('#new-task').fill('Write test plan');
    await expect(page.locator('#new-task')).toHaveValue('Write test plan');
    await page.locator('//*[@class="material-icons"][normalize-space()="add"]').nth(0).click();
    await page.locator('//*[@href="#todo"]').click(); 

    const newTask = page.locator('#text-1');
    await expect(newTask).toHaveText('Write test plan');
  });

  test('add multiple tasks and count them dynamically by ID', async ({ page }) => {
    const taskList = ['Task A', 'Task B', 'Task C'];

    for (const task of taskList) {
      await page.locator('#new-task').fill(task);
      await page.locator('button').nth(0).click();
    }
    await page.locator('//*[@href="#todo"]').click();
  
    for (let i = 1; i <= taskList.length; i++) {
      const taskLocator = `#text-${i}`;
      const taskText = await page.locator(taskLocator).textContent();
      await expect(taskText).toBe(taskList[i - 1]);
    }
  });


  test('mark a task as completed', async ({ page }) => {
    await page.locator('#new-task').fill('Complete this');
    await page.locator('button').nth(0).click();
    await page.locator('//*[@href="#todo"]').click(); 

    const incompleteList = page.locator('#text-1');
    await expect(incompleteList).toHaveCount(1);
    await page.locator('//*[@id="text-1"]').nth(0).click();
    await page.locator('//*[@href="#completed"]').nth(0).click(); 
  
    const completedList = page.locator('#completed-tasks');
    await expect(completedList).toHaveCount(1);
    await expect(completedList).toContainText('Complete this');
  });

  test('delete a task from incomplete list', async ({ page }) => {
    await page.locator('#new-task').fill('Delete me');
    await page.locator('button').nth(0).click();
    await page.locator('//*[@href="#todo"]').click(); 

    const deleteBtn = page.locator('#incomplete-tasks .delete').nth(0);
    await deleteBtn.click();

    const tasks = page.locator('#incomplete-tasks li');
    await expect(tasks).toHaveCount(0);
  });

  test('delete a task from completed list', async ({ page }) => {
    await page.locator('#new-task').fill('Finish QA Report');
    await page.locator('button').nth(0).click();
    await page.locator('//*[@href="#todo"]').click(); 

    await page.locator('#text-1').nth(0).click(); 
    await page.locator('//*[@href="#completed"]').nth(0).click();
    const deleteBtn = page.locator('#completed-tasks .delete').nth(0);
    await deleteBtn.click();

    const tasks = page.locator('#completed-tasks li');
    await expect(tasks).toHaveCount(0);
  });


});
