import UserListItem from "./UserListItem";
import { DefaultPrivacyLevel, User } from "../models";

const mockUser: User = {
  id: "user-id-1",
  uuid: "uuid-1",
  firstName: "Francisco",
  lastName: "Filho",
  username: "fpaulino",
  password: "hashed",
  email: "francisco@exemplo.com",
  phoneNumber: "99999-9999",
  balance: 100,
  avatar: "https://example.com/avatar.png",
  defaultPrivacyLevel: "public" as DefaultPrivacyLevel,
  createdAt: new Date(),
  modifiedAt: new Date(),
};

describe("<UserListItem />", () => {
  it("deve renderizar os dados do usuário corretamente", () => {
    const setReceiver = cy.stub().as("setReceiver");

    cy.mount(<UserListItem user={mockUser} setReceiver={setReceiver} index={0} />);

    cy.get(`[data-test="user-list-item-${mockUser.id}"]`).should("exist");

    cy.contains("Francisco Filho").should("exist");
    cy.contains("U:").next().should("contain", mockUser.username);
    cy.contains("E:").next().should("contain", mockUser.email);
    cy.contains("P:").next().should("contain", mockUser.phoneNumber);
  });

  it("deve chamar setReceiver ao clicar no item", () => {
    const setReceiver = cy.stub().as("setReceiver");

    cy.mount(<UserListItem user={mockUser} setReceiver={setReceiver} index={0} />);

    cy.get(`[data-test="user-list-item-${mockUser.id}"]`).click();

    cy.get("@setReceiver").should("have.been.calledOnceWith", mockUser);
  });
});
