/// <reference types="cypress" />
import contrato from '../contracts/usuarios.contract'
describe('Testes da Funcionalidade Usuários', () => {
     let token
     before(() => {
          cy.token('fulano@qa.com', 'teste').then(tkn => { token = tkn })
     });
     it('Deve validar contrato de usuários', () => {
          cy.request('usuarios').then(response => {
               return contrato.validateAsync(response.body)
          })
     });
     it('Deve listar usuários cadastrados', () => {
          cy.request({
               method: 'GET',
               url: 'usuarios'
          }).then((response) => {
               expect(response.status).to.equal(200)
               expect(response.body.usuarios[0].nome).to.equal('Ana Silva Camilo')
               expect(response.body).to.have.property('usuarios')
               expect(response.duration).to.be.lessThan(15)
          })
     });
     it('Deve cadastrar um usuário com sucesso', () => {
          let email = `pitoco.${Math.floor(Math.random() * 10000000) }dog@teste.com`

          cy.cadastrarUsuarios('Ronaldo', email, 'petpug', 'true')
          .then((response) => {
               expect(response.status).to.equal(201)
               expect(response.body.message).to.equal('Cadastro realizado com sucesso')
          })
     });
     it('Deve validar um usuário com email inválido', () => {
          cy.cadastrarUsuarios('Ronaldo', 'pitoco.5739274dog@teste.com', 'teste', 'true')
          .then((response) => {
               expect(response.status).to.equal(400)
               expect(response.body.message).to.equal('Este email já está sendo usado')
          })
     });
     it('Deve editar um usuário previamente cadastrado', () => {
          let email = `pitoco.${Math.floor(Math.random() * 10000000) }dog@teste.com`
          cy.cadastrarUsuarios('Ronaldo', email, 'teste', 'true')
          .then(response =>{
               let id = response.body._id
               cy.request({
                    method: 'PUT',
                    url: `usuarios/${id}`,
                    body: {
                         "nome": "Ronaldo da Silva",
                         "email": `beltrano.${Math.floor(Math.random() * 10000000) }@qa.com.br`,
                         "password": "teste",
                         "administrador": "true"
                       }
               })
          }).then((response) => {
               expect(response.status).to.equal(200)
               expect(response.body.message).to.equal('Registro alterado com sucesso')  
          })
     });
     it('Deve deletar um usuário previamente cadastrado', () => {
          let email = `pitoco.${Math.floor(Math.random() * 10000000) }dog@teste.com`
          cy.cadastrarUsuarios('Ronaldo', email, 'teste', 'true')
          .then(response =>{
               let id = response.body._id
               cy.request({
                    method: 'DELETE',
                    url: `usuarios/${id}`,
               })
          }).then((response) => {
               expect(response.status).to.equal(200)
               expect(response.body.message).to.equal('Registro excluído com sucesso')  
          })
     });
});
