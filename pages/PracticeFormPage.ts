import { Locator, Page } from '@playwright/test';

export class PracticeFormPage {
  readonly page: Page;

  // ─── Inputs básicos ─────────────────────────────────────────
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly email: Locator;
  readonly mobile: Locator;
  readonly dateOfBirth: Locator;
  readonly subjectsInput: Locator;
  readonly pictureUpload: Locator;
  readonly currentAddress: Locator;

  // ─── Género ─────────────────────────────────────────────────
  readonly genderMale: Locator;
  readonly genderFemale: Locator;
  readonly genderOther: Locator;

  // ─── Hobbies (labels + inputs reales) ───────────────────────
  readonly hobbySportsLabel: Locator;
  readonly hobbyReadingLabel: Locator;
  readonly hobbyMusicLabel: Locator;

  readonly hobbySportsInput: Locator;
  readonly hobbyReadingInput: Locator;
  readonly hobbyMusicInput: Locator;

  // ─── Selects custom ─────────────────────────────────────────
  readonly stateSelect: Locator;
  readonly citySelect: Locator;

  // ─── Submit / Modal ─────────────────────────────────────────
  readonly submitButton: Locator;
  readonly submissionModal: Locator;

  constructor(page: Page) {
    this.page = page;

    // Inputs
    this.firstName = page.locator('#firstName');
    this.lastName = page.locator('#lastName');
    this.email = page.locator('#userEmail');
    this.mobile = page.locator('#userNumber');
    this.dateOfBirth = page.locator('#dateOfBirthInput');
    this.subjectsInput = page.locator('#subjectsInput');
    this.pictureUpload = page.locator('#uploadPicture');
    this.currentAddress = page.locator('#currentAddress');

    // Género
    this.genderMale = page.locator('label[for="gender-radio-1"]');
    this.genderFemale = page.locator('label[for="gender-radio-2"]');
    this.genderOther = page.locator('label[for="gender-radio-3"]');

    // Hobbies - labels
    this.hobbySportsLabel = page.locator('label[for="hobbies-checkbox-1"]');
    this.hobbyReadingLabel = page.locator('label[for="hobbies-checkbox-2"]');
    this.hobbyMusicLabel = page.locator('label[for="hobbies-checkbox-3"]');

    // Hobbies - inputs reales (para asserts)
    this.hobbySportsInput = page.locator('#hobbies-checkbox-1');
    this.hobbyReadingInput = page.locator('#hobbies-checkbox-2');
    this.hobbyMusicInput = page.locator('#hobbies-checkbox-3');

    // Selects
    this.stateSelect = page.locator('#state');
    this.citySelect = page.locator('#city');

    // Submit / Modal
    this.submitButton = page.locator('#submit');
    this.submissionModal = page.locator('.modal-content');
  }

  // ─── Utilidades ─────────────────────────────────────────────

  /**
   * Elimina anuncios flotantes que interfieren con la interacción
   */
  async removeAds(): Promise<void> {
    await this.page.evaluate(() => {
      document.querySelector('#fixedban')?.remove();
      document
        .querySelectorAll('iframe[src*="ads"]')
        .forEach(iframe => iframe.remove());
    });
  }

  /**
   * Navega al formulario y espera a que esté listo
   */
  async goto(): Promise<void> {
    await this.page.goto(
      'https://demoqa.com/automation-practice-form',
      { waitUntil: 'domcontentloaded' }
    );

    await this.firstName.waitFor({ state: 'visible', timeout: 10000 });
    await this.removeAds();
  }

  // ─── Métodos de llenado ──────────────────────────────────────

  async fillFirstName(value: string): Promise<void> {
    await this.firstName.fill(value);
  }

  async fillLastName(value: string): Promise<void> {
    await this.lastName.fill(value);
  }

  async fillEmail(value: string): Promise<void> {
    await this.email.fill(value);
  }

  async fillMobile(value: string): Promise<void> {
    await this.mobile.fill(value);
  }

  async setDateOfBirth(date: string): Promise<void> {
    await this.dateOfBirth.fill(date); // Ej: "10 Oct 1995"
  }

  async addSubject(subject: string): Promise<void> {
    await this.subjectsInput.fill(subject);
    await this.subjectsInput.press('Enter');
  }

  async fillCurrentAddress(address: string): Promise<void> {
    await this.currentAddress.fill(address);
  }

  // ─── Acciones ───────────────────────────────────────────────

  async selectGender(gender: 'Male' | 'Female' | 'Other'): Promise<void> {
    const genderMap = {
      Male: this.genderMale,
      Female: this.genderFemale,
      Other: this.genderOther
    };

    await genderMap[gender].click();
  }

  async selectHobby(hobby: 'Sports' | 'Reading' | 'Music'): Promise<void> {
    const hobbyMap = {
      Sports: this.hobbySportsLabel,
      Reading: this.hobbyReadingLabel,
      Music: this.hobbyMusicLabel
    };

    const locator = hobbyMap[hobby];
    await locator.scrollIntoViewIfNeeded();
    await locator.click();
  }

  async uploadPicture(filePath: string): Promise<void> {
    await this.pictureUpload.setInputFiles(filePath);
  }

 async selectState(state: string): Promise<void> {
  await this.stateSelect.scrollIntoViewIfNeeded();
  await this.stateSelect.click();
  await this.page.keyboard.type(state);
  await this.page.keyboard.press('Enter');
}

async selectCity(city: string): Promise<void> {
  await this.citySelect.scrollIntoViewIfNeeded();
  await this.citySelect.click();
  await this.page.keyboard.type(city);
  await this.page.keyboard.press('Enter');
}


  async submit(): Promise<void> {
    await this.submitButton.click();
    await this.submissionModal.waitFor({
      state: 'visible',
      timeout: 5000
    });
  }

  async isSubmissionModalVisible(): Promise<boolean> {
    try {
      await this.submissionModal.waitFor({
        state: 'visible',
        timeout: 3000
      });
      return true;
    } catch {
      return false;
    }
  }
}
