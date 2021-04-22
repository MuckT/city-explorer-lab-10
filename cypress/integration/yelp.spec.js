/// <reference types="cypress" />

describe('/movies', () => {
  it('returns JSON', () => {
    cy.request(`/movies?location=Seattle`)
      .its('headers')
      .its('content-type')
      .should('include', 'application/json')
  });

  it('returns 20 items', () => {
    cy.request('/movies?location=Seattle')
      .its('body')
      .should('have.length', 20)
  });
});