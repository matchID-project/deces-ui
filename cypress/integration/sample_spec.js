describe('Select a year and take screenshot', () => {
  it('successfully loads', () => {
    cy.visit('/search?advanced=true&view=agg&dd=1982')
    cy.wait(8000)
    cy.screenshot()
  })
})
