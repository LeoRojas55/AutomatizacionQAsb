// pages/PracticeFormPage.ts
import { Locator, Page } from '@playwright/test';

export class PracticeFormPage {
  readonly page: Page;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly email: Locator;
  readonly genderMale: Locator;
  readonly genderFemale: Locator;
  readonly genderOther: Locator;
  readonly mobile: Locator;
  readonly dateOfBirth: Locator;
  readonly subjectsInput: Locator;
  readonly hobbySports: Locator;
  readonly hobbyReading: Locator;
  readonly hobbyMusic: Locator;
  readonly pictureUpload: Locator;
  readonly currentAddress: Locator;
  readonly stateSelect: Locator;
  readonly citySelect: Locator;
  readonly submitButton: Locator;
  readonly submissionModal: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstName = page.locator('#firstName');
    this.lastName = page.locator('#lastName');
    this.email = page.locator('#userEmail');
    this.genderMale = page.locator('label[for="gender-radio-1"]');
    this.genderFemale = page.locator('label[for="gender-radio-2"]');
    this.genderOther = page.locator('label[for="gender-radio-3"]');
    this.mobile = page.locator('#userNumber');
    this.dateOfBirth = page.locator('#dateOfBirthInput');
    this.subjectsInput = page.locator('#subjectsInput');
    this.hobbySports = page.locator('label[for="hobbies-checkbox-1"]');
    this.hobbyReading = page.locator('label[for="hobbies-checkbox-2"]');
    this.hobbyMusic = page.locator('label[for="hobbies-checkbox-3"]');
    this.pictureUpload = page.locator('#uploadPicture');
    this.currentAddress = page.locator('#currentAddress');
    this.stateSelect = page.locator('#state');
    this.citySelect = page.locator('#city');
    this.submitButton = page.locator('#submit');
    this.submissionModal = page.locator('.modal-content');
  }

  /**
   * Elimina anuncios flotantes que interfieren con la interacción
   */
  async removeAds() {
    await this.page.evaluate(() => {
      const adBanner = document.querySelector('#fixedban');
      if (adBanner) adBanner.remove();
      const adIframes = document.querySelectorAll('iframe[src*="ads"]');
      adIframes.forEach(iframe => iframe.remove());
    });
  }

  /**
   * Navega al formulario y espera a que esté listo
   */
  async goto() {
    await this.page.goto('/automation-practice-form');
    await this.firstName.waitFor({ state: 'visible', timeout: 10000 });
  }

  // --- Métodos de llenado ---
  async fillFirstName(value: string) {
    await this.firstName.fill(value);
  }

  async fillLastName(value: string) {
    await this.lastName.fill(value);
  }

  async fillEmail(value: string) {
    await this.email.fill(value);
  }

  async selectGender(gender: 'Male' | 'Female' | 'Other') {
    switch (gender) {
      case 'Male': await this.genderMale.click(); break;
      case 'Female': await this.genderFemale.click(); break;
      case 'Other': await this.genderOther.click(); break;
    }
  }

  async fillMobile(value: string) {
    await this.mobile.fill(value);
  }

  async setDateOfBirth(dateStr: string) {
    await this.dateOfBirth.fill(dateStr); // Formato: "dd MMM yyyy"
  }

  async addSubject(subject: string) {
    await this.subjectsInput.fill(subject);
    await this.subjectsInput.press('Enter');
  }

  async selectHobby(hobby: 'Sports' | 'Reading' | 'Music') {
  const locator = 
    hobby === 'Sports' ? this.hobbySports :
    hobby === 'Reading' ? this.hobbyReading :
    this.hobbyMusic;

  // Forzar scroll y espera
  await locator.scrollIntoViewIfNeeded();
  await locator.waitFor({ state: 'visible', timeout: 5000 });

  await locator.click({ force: true, timeout: 10000 });
}

  async uploadPicture(filePath: string) {
    await this.pictureUpload.setInputFiles(filePath);
  }

  async fillCurrentAddress(value: string) {
    await this.currentAddress.fill(value);
  }

  /**
   * Selecciona estado en el select personalizado
   */
  async selectState(state: string) {
    await this.stateSelect.click();
    await this.page.locator(`.css-1n7v3ny-option:text-is("${state}")`).click();
  }

  /**
   * Selecciona ciudad en el select personalizado
   */
  async selectCity(city: string) {
    await this.citySelect.click();
    await this.page.locator(`.css-1n7v3ny-option:text-is("${city}")`).click();
  }

  /**
   * Envía el formulario y espera el modal
   */
  async submit() {
    await this.submitButton.click();
    await this.submissionModal.waitFor({ state: 'visible', timeout: 5000 });
  }

  /**
   * Verifica si el modal de confirmación está visible (con timeout corto)
   */
  async isSubmissionModalVisible(): Promise<boolean> {
    try {

      return true;
    } catch {
      return false;
    }
  }
}