var conn = require('./db');
var Pagination = require('./pagination');

module.exports = {

    render(req, res, error, success){
        res.render('reservation',{
            title: 'Reservas - Restaurante Saboroso',
            background:'images/img_bg_2.jpg',
            h1: 'Reserve um Mesa!',
            isHome: false,
            body: req.body,
            error,
            success
         })
    },

    getReservations(page, dtstart, dtend){

        if(!page) page = 1;

        let params = []

        if(dtend && dtstart) params.push(dtend, dtstart)
        
        let pag = new Pagination(

            `SELECT sql_calc_found_rows * 
            FROM tb_reservations 
            ${(dtend && dtstart) ? 'WHERE date BETWEEN ? AND ?' : '' } 
            ORDER BY name LIMIT ?, ?
            `, 
            
                params

            
           

        )

        return pag.getPage(page)
    },

    save(fields){

        return new Promise((s, f) =>{

            if(fields.date.indexOf('/') > - 1){

                let date = fields.date.split('/')
                fields.date = `${date[2]}-${date[1]}-${date[0]}`

            }
            

            let query, params = [ fields.name,
                fields.email,
                fields.people,
                fields.date,
                fields.time];

            if(parseInt(fields.id) > 0 ){
                query = `UPDATE tb_reservations
                SET
                    name = ?,
                    email = ?,
                    people = ?,
                    date = ?,
                    time = ?
                WHERE id = ?`;

                params.push(fields.id)

            } 
            else{

                query = `
                INSERT INTO tb_reservations (name, email, people, date, time)
                VALUES(?, ?, ?, ?, ?)
                `
            }

            conn.query(query, params, 
            (err, results) =>{
                if(err){
                    f(err)
                }
                else{
                    s(results)
                }


            }) 
        })

     


    },

    excludeReservation(id){
        return new Promise((s, f) =>{
            conn.query(`DELETE FROM tb_reservations WHERE id = ? `, [
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