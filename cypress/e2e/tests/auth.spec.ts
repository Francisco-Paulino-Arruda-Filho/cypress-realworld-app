import { User } from "../../../src/models";
import { isMobile } from "../../support/utils";
import {
  getUsernameInput,
  getPasswordInput,
  getSubmitButton,
  getErrorAlert,
  getSignUpLink,
} from "../elements/signin.elements";
import {
  getFirstNameInput,
  getLastNameInput,
  getUsernameInput as getSignUpUsernameInput,
  getPasswordInput as getSignUpPasswordInput,
  getConfirmPasswordInput,
  getSubmitButton as getSignUpSubmitButton,
  getSignUpTitle,
} from "../elements/signup.elements";

const apiGraphQL = `${Cypress.env("apiUrl")}/graphql`;

describe("User Sign-up and Login", function () {
  beforeEach(function () {
    cy.task("db:seed");

    cy.intercept("POST", "/users").as("signup");
    cy.intercept("POST", apiGraphQL, (req) => {
      const { body } = req;
      if (body?.operationName === "CreateBankAccount") {
        req.alias = "gqlCreateBankAccountMutation";
      }
    });
  });

  it("should redirect unauthenticated user to signin page", function () {
    cy.visit("/personal");
    cy.location("pathname").should("equal", "/signin");
    cy.visualSnapshot("Redirect to SignIn");
  });

  it("should redirect to the home page after login", function () {
    cy.database("find", "users").then((user: User) => {
      cy.login(user.username, "s3cret", { rememberUser: true });
    });
    cy.location("pathname").should("equal", "/");
  });

  it("should remember a user for 30 days after login", function () {
    cy.database("find", "users").then((user: User) => {
      cy.login(user.username, "s3cret", { rememberUser: true });
    });

    cy.getCookie("connect.sid").should("have.property", "expiry");

    if (isMobile()) {
      cy.getBySel("sidenav-toggle").click();
    }
    cy.getBySel("sidenav-signout").click();
    cy.location("pathname").should("eq", "/signin");
    cy.visualSnapshot("Redirect to SignIn");
  });

  it("should allow a visitor to sign-up, login, and logout", function () {
    const userInfo = {
      firstName: "Bob",
      lastName: "Ross",
      username: "PainterJoy90",
      password: "s3cret",
    };

    cy.visit("/");
    getSignUpLink().click();
    getSignUpTitle().should("be.visible").and("contain", "Sign Up");
    cy.visualSnapshot("Sign Up Title");

    getFirstNameInput().type(userInfo.firstName);
    getLastNameInput().type(userInfo.lastName);
    getSignUpUsernameInput().type(userInfo.username);
    getSignUpPasswordInput().type(userInfo.password);
    getConfirmPasswordInput().type(userInfo.password);
    cy.visualSnapshot("About to Sign Up");
    getSignUpSubmitButton().click();
    cy.wait("@signup");

    cy.login(userInfo.username, userInfo.password);

    cy.getBySel("user-onboarding-dialog").should("be.visible");
    cy.getBySel("list-skeleton").should("not.exist");
    cy.getBySel("nav-top-notifications-count").should("exist");
    cy.visualSnapshot("User Onboarding Dialog");
    cy.getBySel("user-onboarding-next").click();

    cy.getBySel("user-onboarding-dialog-title").should("contain", "Create Bank Account");

    cy.getBySelLike("bankName-input").type("The Best Bank");
    cy.getBySelLike("accountNumber-input").type("123456789");
    cy.getBySelLike("routingNumber-input").type("987654321");
    cy.visualSnapshot("About to complete User Onboarding");
    cy.getBySelLike("submit").click();

    cy.wait("@gqlCreateBankAccountMutation");

    cy.getBySel("user-onboarding-dialog-title").should("contain", "Finished");
    cy.getBySel("user-onboarding-dialog-content").should("contain", "You're all set!");
    cy.visualSnapshot("Finished User Onboarding");
    cy.getBySel("user-onboarding-next").click();

    cy.getBySel("transaction-list").should("be.visible");
    cy.visualSnapshot("Transaction List is visible after User Onboarding");

    if (isMobile()) {
      cy.getBySel("sidenav-toggle").click();
    }
    cy.getBySel("sidenav-signout").click();
    cy.location("pathname").should("eq", "/signin");
    cy.visualSnapshot("Redirect to SignIn");
  });

  it("should display login errors", function () {
    cy.visit("/");

    getUsernameInput().type("User").clear().blur();
    cy.get("#username-helper-text").should("be.visible").and("contain", "Username is required");
    cy.visualSnapshot("Display Username is Required Error");

    getPasswordInput().type("abc").blur();
    cy.get("#password-helper-text")
      .should("be.visible")
      .and("contain", "Password must contain at least 4 characters");
    cy.visualSnapshot("Display Password Error");

    getSubmitButton().should("be.disabled");
    cy.visualSnapshot("Sign In Submit Disabled");
  });

  it("should display signup errors", function () {
    cy.visit("/signup");

    getFirstNameInput().type("First").clear().blur();
    cy.get("#firstName-helper-text").should("be.visible").and("contain", "First Name is required");

    getLastNameInput().type("Last").clear().blur();
    cy.get("#lastName-helper-text").should("be.visible").and("contain", "Last Name is required");

    getSignUpUsernameInput().type("User").clear().blur();
    cy.get("#username-helper-text").should("be.visible").and("contain", "Username is required");

    getSignUpPasswordInput().type("password").clear().blur();
    cy.get("#password-helper-text").should("be.visible").and("contain", "Enter your password");

    getConfirmPasswordInput().type("DIFFERENT PASSWORD").blur();
    cy.get("#confirmPassword-helper-text")
      .should("be.visible")
      .and("contain", "Password does not match");

    getSignUpSubmitButton().should("be.disabled");
    cy.visualSnapshot("Sign Up Submit Disabled");
  });

  it("should error for an invalid user", function () {
    cy.login("invalidUserName", "invalidPa$$word");

    getErrorAlert().should("be.visible").and("have.text", "Username or password is invalid");
    cy.visualSnapshot("Sign In, Invalid Username and Password");
  });

  it("should error for an invalid password for existing user", function () {
    cy.database("find", "users").then((user: User) => {
      cy.login(user.username, "INVALID");
    });

    getErrorAlert().should("be.visible").and("have.text", "Username or password is invalid");
    cy.visualSnapshot("Sign In, Invalid Password");
  });
});
