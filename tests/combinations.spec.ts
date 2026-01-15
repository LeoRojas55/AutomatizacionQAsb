
import { expect, test } from '@playwright/test';
import * as path from 'path';
import { PracticeFormPage } from '../pages/PracticeFormPage';
import { generateTestData, takeScreenshot } from '../utils/helpers';

test.describe('Pruebas Combinatorias y Elementos Dinámicos', () => {
  test('CP03: Combinación género=female, hobbies=sports+reading, estado=NCR/ciudad=Delhi', async ({ page }) => {
    const form = new PracticeFormPage(page);
    await form.goto();
    await form.removeAds();

    const data = generateTestData();
    await form.fillFirstName(data.firstName);
    await form.fillLastName(data.lastName);
    await form.fillEmail(data.email);
    await form.selectGender('Female');
    await form.fillMobile(data.mobile);
    await form.setDateOfBirth(data.dateOfBirth);
    await page.locator('body').click(); // Cierra DatePicker
    await form.addSubject(data.subject);
    await form.removeAds();
    await form.selectHobby('Sports');
    await form.selectHobby('Reading');
    await form.selectState(data.state);
    await form.selectCity(data.city);

    await form.submit();
    expect(await form.isSubmissionModalVisible()).toBeTruthy();
    await takeScreenshot(page, 'combination_success');
  });

  test('CP04: DatePicker con fecha futura válida', async ({ page }) => {
    const form = new PracticeFormPage(page);
    await form.goto();
    await form.removeAds();

    await form.fillFirstName('Alice');
    await form.fillLastName('Johnson');
    await form.fillEmail('alice.johnson@example.com');
    await form.selectGender('Other');
    await form.fillMobile('9876543210');
    await form.setDateOfBirth('14 Jan 2026');

    await form.submit();
    expect(await form.isSubmissionModalVisible()).toBeTruthy();
    await takeScreenshot(page, 'future_date_success');
  });

  test('CP05: Subir imagen + nombre vacío → debe fallar', async ({ page }) => {
    const form = new PracticeFormPage(page);
    await form.goto();
    await form.removeAds();

    // Dejar First Name vacío
    await form.fillLastName('Test');
    await form.fillEmail('test@example.com');
    await form.selectGender('Male');
    await form.fillMobile('1234567890');

    const imagePath = path.resolve(process.cwd(), 'test_image.jpg');
    await form.uploadPicture(imagePath);

    await form.submitButton.click();

    // Scroll al formulario para screenshot
    await page.locator('#firstName').scrollIntoViewIfNeeded();

    // El modal NO debe aparecer
    const isVisible = await form.isSubmissionModalVisible();
    expect(isVisible).toBeFalsy();

    await takeScreenshot(page, 'missing_firstname_fail');
  });
});