/// <reference types="cypress" />

describe('/yelp', () => {
  it('returns JSON', () => {
    cy.request(`/yelp?location=Seattle`)
      .its('headers')
      .its('content-type')
      .should('include', 'application/json')
  });

  it('returns 5 items', () => {
    cy.request('/yelp?location=Seattle')
      .its('body')
      .should('have.length', 5)
  });
});