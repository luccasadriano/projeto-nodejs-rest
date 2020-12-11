const conexao = require('../infrastructure/database/conexao')
const repositories = require('../repositories/atendimento')

const axios = require('axios')
const moment = require('moment')


class Atendimento {
   constructor() {

      //Validação da data e quantidade de caracteres no nome do cliente
      this.dataEhValida = ({ data, dataCriacao }) => moment(data).isSameOrAfter(dataCriacao)
      this.clienteEhValido = (tamanho) => tamanho >= 5

      this.valida = paramentros =>
         this.validacoes.filter(campo => {
            const { nome } = campo
            const paramentro = paramentros[nome]

            return !campo.valido(paramentro)
         })

      this.validacoes = [
         {
            nome: 'data',
            valido: this.dataEhValida,
            mensagem: 'Data deve ser maior ou igual a data atual'
         },
         {
            nome: 'cliente',
            valido: this.clienteEhValido,
            mensagem: 'Cliente deve ter pelo menos cinco caracteres'
         }
      ]
   }

   adiciona(atendimento) {
      //passando formatos da data BR
      const dataCriacao = moment().format('YYYY-MM-DD HH:MM:SS')
      const data = moment(atendimento.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS')

      const paramentros = {
         data: { data, dataCriacao },
         cliente: { tamanho: atendimento.cliente.length }
      }

      const erros = this.valida(paramentros)
      const existemErros = erros.length

      if (existemErros) {
         return new Promise((resolve, reject) => reject(erros))
      } else {
         const atendimentoDatado = { ...atendimento, dataCriacao, data }

         return repositories.adiciona(atendimentoDatado)
            .then((resultados) => {
               const id = resultados.insertId
               return ({ ...atendimento, id })
            })
      }
   }
   lista() {
      return repositories.lista()
   }
   buscaPorId(id, res) {

      const sql = `select * from Atendimentos where id = ${id}`

      conexao.query(sql, async (erro, resultado) => {

         const atendimento = resultado[0]

         const cpf = atendimento.cliente

         if (erro) {
            res.status(400).json(erro)

         } else {
            const { data } = await axios.get(`http://localhost:8082/${cpf}`)

            atendimento.cliente = data

            res.status(200).json(atendimento)
         }
      })
   }
   altera(id, valores, res) {
      if (valores.data) {
         valores.data = moment(valores.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS')
      }
      const sql = `update Atendimentos set ? where id=?`
      conexao.query(sql, [valores, id], (erro, resultado) => {
         if (erro) {
            res.status(400).json(erro)
         } else {
            res.status(200).json({ ...valores, id })
         }
      })
   }
   deleta(id, res) {
      const sql = `delete from Atendimentos where id = ?`
      conexao.query(sql, id, (erro, resultado) => {
         if (erro) {
            res.status(400).json(erro)
         } else {
            res.status(200).json({ id })
         }
      })
   }
}
module.exports = new Atendimento