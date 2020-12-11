const fs = require('fs')
const path = require('path')

module.exports = (caminho, nomeDoArquivo, callbackImagemCriada) => {

   const tiposValidos = ['jpg', 'png', 'jpeg']

   const tipo = path.extname(caminho)
   const tipoEhValido = tiposValidos.indexOf(tipo.substring(1)) !== -1

   if (!tipoEhValido) {
      const erro = 'O tipo da imagem é inválido'
      callbackImagemCriada(erro)
   } else {
      const novoCaminho = `./assets/imagens/${nomeDoArquivo}${tipo}`
      //lear a imagem ou arquivo
      fs.createReadStream(caminho)
         .pipe(fs.createWriteStream(novoCaminho))
         .on('finish', () => callbackImagemCriada(false, novoCaminho))
   }
}