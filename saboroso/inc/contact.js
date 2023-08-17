var conn = require('./db')

module.exports = {

    render(res, req, error, sucess){
        res.render('contact', {
            title: 'Contato - Restaurante Saboroso',
            background:'images/img_bg_3.jpg',
            h1: 'Diga um oi!',
            isHome: false,
            body: req.body,
            error,
            sucess
            //some objects that can be used in the html trought de  EJSTags(embeded js)

         })
    },

    save(fields){

        return new Promise((s, f) =>{
            conn.query(
                `INSERT INTO tb_contacts (name, email, message)
                VALUES (?, ?, ?)`,

                [fields.name,
                fields.email,
                fields.message],

             (err, results) =>{
                if(err){
                    f(err)
                } else{
                    s(results)
                }

            })

        })


    },
    
    getContacts(){

            return new Promise((s, f) =>{
    
                conn.query(`
                SELECT * FROM tb_contacts
                `, (err, results) =>{
    
                    if(err){
                        f(err)
                    } else{
                        s(results)
                    }
                })
    
            })
        }

    


}