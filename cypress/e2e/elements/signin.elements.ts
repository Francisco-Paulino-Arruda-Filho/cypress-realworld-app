// signin.elements.ts

export const getUsernameInput = () => cy.get('[data-test="signin-username"]').find("input");

export const getPasswordInput = () => cy.get('[data-test="signin-password"]').find("input");

export const getRememberMeCheckbox = () => cy.get('[data-test="signin-remember-me"]');

export const getSubmitButton = () => cy.get('[data-test="signin-submit"]');

export const getSignUpLink = () => cy.get('[data-test="signup"]');

export const getErrorAlert = () => cy.get('[data-test="signin-error"]');
