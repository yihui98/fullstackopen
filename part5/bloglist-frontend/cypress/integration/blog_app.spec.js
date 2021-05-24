describe('Blog app', function() {
    beforeEach(function() {
        cy.request('POST', 'http://localhost:3003/api/testing/reset')
        const user = {
            name: "Cypress user",
            username: "user1",
            password: "user1"
        }
        const user2 = {
            name: "Cypress user2",
            username: "user2",
            password: "user2"
        }
        cy.request('POST', 'http://localhost:3003/api/users/', user)
        cy.request('POST', 'http://localhost:3003/api/users/', user2)
        cy.visit('http://localhost:3000')
    })
    it('front page can be opened', function() {
        cy.visit('http://localhost:3000')
        cy.contains('Log in')
        cy.contains('username')
        cy.contains('password')
    })

    describe('Login', function(){
        it('succeeds with correct credentials', function(){
            cy.contains('login').click()
            cy.get('#username').type("user1")
            cy.get('#password').type("user1")
            cy.get('#login-button').click()
            cy.contains('Cypress user is logged in')
        })

        it('fails with wrong credentials', function(){
            cy.contains('login').click()
            cy.get('#username').type("user1")
            cy.get('#password').type("wrong")
            cy.get('#login-button').click()

            cy.get('.error').should('contain', 'Wrong credentials')
            .and('have.css', 'color', 'rgb(255, 0, 0)')
        })
    })

    describe('When logged in', function(){
        beforeEach(function(){
            cy.contains('login').click()
            cy.get('#username').type("user1")
            cy.get('#password').type("user1") //id
            cy.get('#login-button').click()
        })

        it('A blog can be created', function(){
            cy.contains('Create new blog').click()
            cy.get('.title').type("This is the title")//classname
            cy.get('.author').type("I am the author")
            cy.get('.url').type("www.blog.com")
            cy.get('#create').click()

            cy.contains("This is the title I am the author")
            
        })

        it ('A user can like a blog', function(){
            cy.contains('Create new blog').click()
            cy.get('.title').type("This is the title")//classname
            cy.get('.author').type("I am the author")
            cy.get('.url').type("www.blog.com")
            cy.get('#create').click()

            cy.contains("This is the title I am the author")
                .contains("show")
                .click()
            cy.contains('like')
                .click()
            cy.contains('Likes: 1')
        })

        it('A user can delete a blog he has created', function(){
            cy.contains('Create new blog').click()
            cy.get('.title').type("This is the title")//classname
            cy.get('.author').type("I am the author")
            cy.get('.url').type("www.blog.com")
            cy.get('#create').click()

            cy.contains("This is the title I am the author")
                .contains("show")
                .click()
            cy.contains('remove')
                .click()
        })

        it('A user cannot delete other blog', function(){
            cy.contains('Create new blog').click()
            cy.get('.title').type("This is the title")//classname
            cy.get('.author').type("I am the author")
            cy.get('.url').type("www.blog.com")
            cy.get('#create').click()

            cy.contains("Log out").click()
            cy.get('#username').type("user2")
            cy.get('#password').type("user2") //id
            cy.get('#login-button').click()

            cy.contains("This is the title I am the author")
            .contains("show")
            .click()

            cy.contains('remove').should('not.exist')
       })

    })
})