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

    },

    postMenus(data, files){
        // saving a new menu/product to the mysql
        return new Promise((s, f) =>{

            //data.photo = `images/${path.parse(files.photo.//filepath).base}`
            //files.photo = persistentFile de merda
            data.photo = `images/${files.photo}`

            let query, queryPhoto = ',photo = ?',
            params = [ 
                data.title,
                data.description,
                data.price,
                data.photo

            ];

            /*if(files.photo.name){

                queryPhoto = ', photo = ?'
                params.push(data.photo)
            }*/

            //updating datas from menu
            if(parseInt(data.id) > 0){
                
                params.push(data.id)

                query = `
                UPDATE tb_menus 
                SET title = ?,
                    description = ?,
                    price = ?
                     ${queryPhoto}
                WHERE id = ?
                `

                //creating datas from menu
            }
             else{

               /* if(!files.photo){
                    f('Envie a foto do prato!')
                }*/
                params.push()

                query = `
                INSERT INTO tb_menus (title, description, price, photo)
                VALUES (?, ?, ?, ?)`;
              

            }

            conn.query(query, params, (err, results) => {
    
                if(err){
                    f(err)
                }
                else{
                    s(results)
                }
    
            })
        })


    },

   excludeMenu(id){

    return new Promise((s, f) =>{
        conn.query(`DELETE FROM tb_menus WHERE id = ? `, [
            id
        ], (err, result) =>{
            if(err){
                f(err)

            } else{
                s(result)
            }
        })
    })
}

}