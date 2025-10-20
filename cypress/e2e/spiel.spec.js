describe('Bundesländer Spiel', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173') // Vite dev server
  })

  it('zeigt Punkte an', () => {
    cy.get('[data-testid=punkte]').should('contain.text', 'Punkte')
  })

  it('verhindert XSS im Textfeld', () => {
    cy.get('input[placeholder="Name, Datum, Zusatz"]')
      .type('<script>alert("XSS")</script>')
      .should('have.value', '<script>alert("XSS")</script>')
    
    // Prüfen, dass kein Alert auftaucht
    cy.on('window:alert', () => {
      throw new Error('XSS ausgeführt!')
    })
  })
})
