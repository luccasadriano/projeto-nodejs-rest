const fs = require('fs')

//lear a imagem ou arquivo
fs.createReadStream('./assets/doguinho.jpg')
   .pipe(fs.createWriteStream('./assets/doguinho-stream.jpg'))
   .on('finish', () => console.log('Imagem foi escrita com sucesso!'))