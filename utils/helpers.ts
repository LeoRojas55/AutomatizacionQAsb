
import { faker } from '@faker-js/faker';
import { Page } from '@playwright/test';

/**
 * Toma una captura de pantalla completa de la página actual.
 * @param page - Instancia de la página de Playwright.
 * @param name - Nombre base para el archivo de screenshot.
 */
export async function takeScreenshot(page: Page, name: string) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const path = `reports/screenshots/${name}_${timestamp}.png`;
  await page.locator('#firstName').scrollIntoViewIfNeeded();
  await page.screenshot({
    path,
    fullPage: true // Captura toda la página, no solo el viewport visible
  });
  
  console.log(`📸 Screenshot guardado: ${path}`);
}

/**
 * Genera datos de prueba realistas usando Faker.
 * @returns Objeto con datos de formulario válidos.
 */
export function generateTestData() {
  // Generar un número de 10 dígitos que no comience por 0
  const firstDigit = faker.number.int({ min: 1, max: 9 }).toString();
  const remainingDigits = faker.string.numeric({ length: 9, allowLeadingZeros: true });
  const mobile = firstDigit + remainingDigits;

  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    mobile,
    dateOfBirth: '14 Jan 2002', // Fecha fija para consistencia
    subject: 'Computer Science',
    address: faker.location.streetAddress(),
    state: 'NCR',
    city: 'Delhi',
  };
}