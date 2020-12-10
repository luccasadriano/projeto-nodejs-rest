const customExpress = require('./config/customExpress')
const conexao = require('./db/conexao')
const { init } = require('./db/tabelas')
const app = customExpress()
const Tabelas = require('./db/tabelas')

try {
   conexao.connect(console.log('Conectado ao banco de dados com sucesso!'))

   Tabelas.init(conexao)

   app.listen(3000, () => console.log('Start servidor port 3000'))
} catch (error) {
   console.log(error)
}

// conexao.connect(erro => {
//    if (erro) {
//       console.log(erro)
//    } else {
//       console.log('Conectado ao banco de dados com sucesso!')
//       app.listen(3000, () => console.log('Start servidor port 3000'))
//    }
// })
