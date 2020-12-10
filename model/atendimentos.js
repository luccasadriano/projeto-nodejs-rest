const axios = require('axios')
const moment = require('moment')
const conexao = require('../db/conexao')

class Atendimento {
   adiciona(atendimento, res) {
      const dataCriacao = moment().format('YYYY-MM-DD HH:MM:SS')
      const data = moment(atendimento.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS')

      //Validação da data e quantidade de caracteres no nome do cliente
      const dataEValida = moment(data).isSameOrAfter(dataCriacao)
      const clienteEValido = atendimento.cliente.length >= 5

      const validacoes = [
         {
            nome: 'data',
            valido: dataEValida,
            mensagem: 'Data deve ser maior ou igual a data atual'
         },
         {
            nome: 'cliente',
            valido: clienteEValido,
            mensagem: 'Cliente deve ter pelo menos cinco caracteres'
         }
      ]

      const erros = validacoes.filter(campo => !campo.valido)
      const existemErros = erros.length

      if (existemErros) {
         res.status(400).json(erros)
      } else {
         const atendimentoDatado = { ...atendimento, dataCriacao, data }

         //insert tabela
         const sql = `INSERT INTO Atendimentos SET ?`
         conexao.query(sql, atendimentoDatado, (erro, resultado) => {
            if (erro) {
               res.status(400).json(erro)
            } else {
               res.status(201).json({...atendimento, id})
            }
         })
      }
   }
   lista(res) {
      const sql = `select * from Atendimentos`
      conexao.query(sql, (erro, resultados) => {
         if (erro) {
            res.status(400).json(erro)
         } else {
            res.status(200).json(resultados)
         }
      })
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