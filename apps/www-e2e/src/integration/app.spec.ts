import { getGreeting } from '../support/app.po';

describe('www', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    getGreeting().contains('Trivia');
  });
});
