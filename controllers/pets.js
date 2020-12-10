const Pet = require('../model/pets')

module.exports = app => {
    app.post('/pet', (req, res) => {
        const pet = req.body 
        
        Pet.adicionar(pet, res)

        // res.send("OK")
    })
}