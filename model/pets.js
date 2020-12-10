const pets = require('../controllers/pets')
const conexao = require('../db/conexao')
const uploadDeArquivo = require('../arquivos/uploadArquivos')

class Pet {
    adicionar(pet, res) {
        const query = `Insert into Pets SET ?`

        uploadDeArquivo(pet.imagem, pet.nome, (erro, novoCaminho) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                const novoPet = { nome: pet.nome, imagem: novoCaminho }

                conexao.query(query, novoPet, erro => {
                    if (erro) {
                        console.log(erro)
                        res.status(400).json(erro)
                    } else {
                        res.status(200).json(novoPet)
                    }
                })
            }
        })
    }
}

module.exports = new Pet()