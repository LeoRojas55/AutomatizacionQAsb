
import { expect, test } from '@playwright/test';
import { PracticeFormPage } from '../pages/PracticeFormPage';
import { takeScreenshot } from '../utils/helpers';

test.describe('Pruebas de Valores Límite - Mobile', () => {
  test('CP01: Mobile con 9 dígitos → debe fallar', async ({ page }) => {
    const form = new PracticeFormPage(page);
    await form.goto();
    await form.removeAds();

    await form.fillFirstName('John');
    await form.fillLastName('Doe');
    await form.fillEmail('john.doe@example.com');
    await form.selectGender('Male');
    await form.fillMobile('123456789'); // 9 dígitos

    await form.submitButton.click();

    // El modal NO debe aparecer
    const isVisible = await form.isSubmissionModalVisible();
    expect(isVisible).toBeFalsy();
    await takeScreenshot(page, 'mobile_9_digits_fail');
  });

  test('CP02: Mobile con 10 dígitos → debe tener éxito', async ({ page }) => {
    const form = new PracticeFormPage(page);
    await form.goto();
    await form.removeAds();

    await form.fillFirstName('Jane');
    await form.fillLastName('Smith');
    await form.fillEmail('jane.smith@example.com');
    await form.selectGender('Female');
    await form.fillMobile('1234567890'); // 10 dígitos

    await form.submit();
    expect(await form.isSubmissionModalVisible()).toBeTruthy();
    await takeScreenshot(page, 'mobile_10_digits_success');
  });
});