const query = require('../infrastructure/database/queries')

class Atendimento {

   adiciona(atendimento) {

      const sql = `insert into Atendimentos set ?`
      return query(sql, atendimento)

   }
   lista() {
      const sql = `select * from Atendimentos`
      return query(sql)
   }
}
module.exports = new Atendimento()