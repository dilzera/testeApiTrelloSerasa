const apiKey = Cypress.env('TRELLO_API_KEY');
const token = Cypress.env('TRELLO_TOKEN');

describe('API Test - Trello', () => {
  let boardId = null; // Declara a variável no escopo do describe
  let listId = null;  // Variável para armazenar o ID da lista
  let cardId = null; // Pode ser acessada por qualquer it dentro deste describe
  
  it('Criar board com nome válido', () => {
    cy.request({
      method: 'POST',
      url: `https://api.trello.com/1/boards/?name=BoardValido&key=${Cypress.env('TRELLO_API_KEY')}&token=${Cypress.env('TRELLO_TOKEN')}`,
    }).then(response => {
      expect(response.status).to.eq(200);
      boardId = response.body.id; // Salvar o ID do board para uso nos testes subsequentes
      });
  });

  it('Criar board sem nome', () => {
    cy.request({
      method: 'POST',
      url: `https://api.trello.com/1/boards/?key=${Cypress.env('TRELLO_API_KEY')}&token=${Cypress.env('TRELLO_TOKEN')}`,
      failOnStatusCode: false, // Isso permite que a solicitação seja concluída mesmo que o status não seja 2xx
    }).then(response => {
      expect(response.status).to.eq(400); // Um código de status 400 é esperado quando o nome é omitido
    });
  });

  it('Criar card com nome e descrição válidos', () => {
    // Certifique-se de que o boardId foi definido antes de tentar usar
    expect(boardId).not.to.be.null;

    // Buscar as listas do board para obter o ID da lista (idList)
    cy.request({
      method: 'GET',
      url: `https://api.trello.com/1/boards/${boardId}/lists?key=${Cypress.env('TRELLO_API_KEY')}&token=${Cypress.env('TRELLO_TOKEN')}`,
    }).then(response => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.length.at.least(1); // Verifica se há pelo menos uma lista no board
      const listId = response.body[0].id; // Pega o ID da primeira lista


      cy.request({
        method: 'POST',
        url: `https://api.trello.com/1/cards?idList=${listId}&name=CardValido&desc=Descrição válida&key=${Cypress.env('TRELLO_API_KEY')}&token=${Cypress.env('TRELLO_TOKEN')}`,
      }).then(cardResponse => {
        expect(cardResponse.status).to.eq(200);
        cardId = cardResponse.body.id; // Verifique se esta linha está correta
      });
    });
  });
    
  
  it('Criar card sem nome', () => {
    cy.request({
      method: 'POST',
      url: `https://api.trello.com/1/cards?idList=${boardId}&key=${Cypress.env('TRELLO_API_KEY')}&token=${Cypress.env('TRELLO_TOKEN')}`,
      failOnStatusCode: false, // Permite que a solicitação seja concluída mesmo que o status não seja 2xx
    }).then(response => {
      expect(response.status).to.eq(404); // Espera-se um código de status 400 quando o nome é omitido
    });
  });

  it('Excluir card existente', () => {
    // Certifique-se de que o cardId foi definido
    expect(cardId).not.to.be.null;

    // Faz a requisição para excluir o card
    cy.request({
      method: 'DELETE',
      url: `https://api.trello.com/1/cards/${cardId}?key=${Cypress.env('TRELLO_API_KEY')}&token=${Cypress.env('TRELLO_TOKEN')}`,
    }).then(deleteResponse => {
      expect(deleteResponse.status).to.eq(200);
    });
  });

  it('Excluir card inexistente', () => {
    cy.request({
      method: 'DELETE',
      url: `https://api.trello.com/1/cards/${cardId}?key=${Cypress.env('TRELLO_API_KEY')}&token=${Cypress.env('TRELLO_TOKEN')}`,
      failOnStatusCode: false, // Permite que a solicitação seja concluída mesmo que o status não seja 2xx
    }).then(response => {
      expect(response.status).to.eq(404); // Espera-se um código de status 404 para um card inexistente
    });
  });

  it('Excluir board existente', () => {
    cy.request({
      method: 'DELETE',
      url: `https://api.trello.com/1/boards/${boardId}?key=${Cypress.env('TRELLO_API_KEY')}&token=${Cypress.env('TRELLO_TOKEN')}`,
    }).then(response => {
      expect(response.status).to.eq(200);
    });
  });

  it('Excluir board inexistente', () => {
    cy.request({
      method: 'DELETE',
      url: `https://api.trello.com/1/boards/${boardId}?key=${Cypress.env('TRELLO_API_KEY')}&token=${Cypress.env('TRELLO_TOKEN')}`,
      failOnStatusCode: false,
    }).then(response => {
      expect(response.status).to.eq(404); // Espera-se um código de status 404 para um board inexistente
    });
  });

});