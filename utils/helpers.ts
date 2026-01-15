
import { faker } from '@faker-js/faker';
import { Page } from '@playwright/test';

/**
 * Toma una captura de pantalla completa del formulario.
 */
export async function takeScreenshot(page: Page, name: string): Promise<void> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const path = `reports/screenshots/${name}_${timestamp}.png`;

  // Asegurar que el formulario esté visible
  await page.locator('#firstName').scrollIntoViewIfNeeded();

  await page.screenshot({
    path,
    fullPage: true
  });

  console.log(`📸 Screenshot guardado: ${path}`);
}

/**
 * Genera datos de prueba realistas.
 */
export function generateTestData() {
  const firstDigit = faker.number.int({ min: 1, max: 9 }).toString();
  const remainingDigits = faker.string.numeric({ length: 9, allowLeadingZeros: true });
  const mobile = firstDigit + remainingDigits;

  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    mobile,
    dateOfBirth: '14 Jan 2026',
    subject: 'Computer Science',
    address: faker.location.streetAddress(),
    state: 'NCR',
    city: 'Delhi',
  };
}