let conn = require('./db');
//var thats represent the connection with the db
//realiazando uma query no mysql, armazenando o resultado em variaveis apresentaveis por meio de EJSTAGS no html.
module.exports = {
    getMenus(){
        return new Promise((r, f) =>{
            conn.query('SELECT * FROM tb_menus ORDER BY title',
            (err, result) =>{

                if(err){
                    console.log(err)
                }
                else{
                   r(result)
                
                }

            })

        })

    }
}