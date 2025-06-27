import { interpret } from "xstate";
import { MemoryRouter } from "react-router-dom";
import SignUpForm from "./SignUpForm";
import { authMachine } from "../machines/authMachine";

import {
  getFirstNameInput,
  getLastNameInput,
  getUsernameInput,
  getPasswordInput,
  getConfirmPasswordInput,
  getSubmitButton,
} from "../../cypress/e2e/elements/signup.elements";

describe("SignUpForm - Validations", () => {
  let authService;
  beforeEach(() => {
    authService = interpret(authMachine);
    authService.start();
    cy.mount(
      <MemoryRouter>
        <SignUpForm authService={authService} />
      </MemoryRouter>
    );
  });

  it("should display required field errors when fields are blurred", () => {
    getFirstNameInput().focus().blur();
    cy.contains("First Name is required").should("exist");

    getLastNameInput().focus().blur();
    cy.contains("Last Name is required").should("exist");

    getUsernameInput().focus().blur();
    cy.contains("Username is required").should("exist");

    getPasswordInput().focus().blur();
    cy.contains("Enter your password").should("exist");

    getConfirmPasswordInput().focus().blur();
    cy.contains("Confirm your password").should("exist");

    getSubmitButton().should("be.disabled");
  });
});
