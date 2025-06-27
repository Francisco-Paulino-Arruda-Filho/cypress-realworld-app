// signup.elements.ts

export const getFirstNameInput = () => cy.get('[data-test="signup-first-name"]').find("input");

export const getLastNameInput = () => cy.get('[data-test="signup-last-name"]').find("input");

export const getUsernameInput = () => cy.get('[data-test="signup-username"]').find("input");

export const getPasswordInput = () => cy.get('[data-test="signup-password"]').find("input");

export const getConfirmPasswordInput = (): Cypress.Chainable<JQuery<HTMLInputElement>> =>
  cy.get('[data-test="signup-confirmPassword"]').find("input");

export const getSubmitButton = () => cy.get('[data-test="signup-submit"]');

export const getSignUpTitle = () => cy.get('[data-test="signup-title"]');
