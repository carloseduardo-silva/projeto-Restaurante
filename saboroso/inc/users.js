var conn = require('./db')

module.exports = {


    render(res, req, error){
        res.render('admin/login', {
            body:req.body,
            error
        })

    },

    login(email, password){
        return new Promise((s, f )=>{

            conn.query(`
            SELECT * FROM tb_users WHERE email = ?`, [
                email
            ], (err, results) =>{
                if(err){
                    f(err)
                }
                else{

                    if(!results.length > 0){

                        f('Usuário ou Senha incorretos')
                    }
                    else{

                        let row = results[0]
                        
                        if(row.password !== password ){
                            f('Usuário ou senha incorretos')

                        }
                        else{
                            s(row)
                        }

                    }

                }
            }

        )})
    },

    getUsers(){

        return new Promise((s, f) =>{

            conn.query(`
            SELECT * FROM tb_users
            `, (err, results) =>{

                if(err){
                    f(err)
                } else{
                    s(results)
                }
            })

        })
    },

    save(data){

        return new Promise((s, f) =>{

            let query, params = [
                data.name,
                data.email

            ]

            
            if(parseInt(data.id) > 0){
                
                params.push(data.id)

                query = `
                UPDATE tb_menus 
                SET name = ?,
                    email = ?
                WHERE id = ?`

            }
            else{
                params.push(data.password)
                query =`INSERT INTO tb_users (name, email, password)
                VALUES (?, ?, ?)`
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

    excludeUser(id){

        return new Promise((s, f) =>{

            conn.query(`DELETE FROM tb_users WHERE id = ? `, [
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
