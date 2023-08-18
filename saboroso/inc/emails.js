var conn = require('./db')

module.exports = {

    getEmail(){

        return new Promise((s, f) =>{

            conn.query(`SELECT * FROM tb_menus`, (err, result) =>{

                if(err){
                    f(err)}
                else{
                    s(result)
                }

            })

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