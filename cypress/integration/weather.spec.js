/// <reference types="cypress" />

describe('/weather', () => {
  describe.skip('Cache', () => {
    before(() => {
      cy.request({
        url: '/weather',
        qs: {
          lat: 47.6038321,
          lon: -122.3300624,
        },
      }).as('weather');
      cy.get('@weather').should((response) => {
        expect(response.status).to.equal(200);
      });
    });

    it('second request has status code 304', () => {
      cy.request({
        url: '/weather',
        qs: {
          lat: 47.6038321,
          lon: -122.3300624,
        },
      }).as('weather');
      cy.get('@weather').should((response) => {
        expect(response.status).to.equal(304);
      });
    });
  });


  describe('Response Validation', () => {
    it('returns JSON', () => {
      cy.request(`/weather?lat=47.6038321&lon=-122.3300624`)
        .its('headers')
        .its('content-type')
        .should('include', 'application/json')
    });
  
    it('returns 5 items', () => {
      cy.request('/weather?lat=47.6038321&lon=-122.3300624')
        .its('body')
        .should('have.length', 5)
    });
  })
});
