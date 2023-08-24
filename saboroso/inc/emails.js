var conn = require('./db')


//miss config the tb_emails(dont existis in the mysql) + emails.ejs with assinc datas.
module.exports = {

    getEmail(){

        return new Promise((s, f) =>{

            conn.query(`SELECT * FROM tb_emails`, (err, result) =>{

                if(err){
                    f(err)}
                else{
                    s(result)
                }

            })

        })

    },

    save(req){

        return new Promise((s, f) => {

            if(!req.fields.email){
               f('Preencha o Email')
              } 
              else{

                conn.query(`
                INSERT INTO tb_emails (email) VALUES (?)`,
                [
                  req.fields.email
                ],
                 (err, results) =>{
                  if(err){
                    f(err.message)
            
                  } else{
                    s(results)
                    
                  }
                })
              }
        })
    },




    excludeEmail(id){

        return new Promise((s, f) =>{

            conn.query(`DELETE FROM tb_emails WHERE id = ? `, [
                id
            ], (err, result) =>{
                if(err){
                    f(err)
    
                } else{
                    s(result)
                }
            }
            )

        })
    }



}