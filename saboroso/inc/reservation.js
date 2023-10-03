var conn = require('./db');
var Pagination = require('./pagination');
var moment = require('moment')

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

    getReservations(req){

        let page = req.query.page
        let dtstart = req.query.start
        let dtend = req.query.end

        return new Promise((s, f) =>{

            if(!page) page = 1;
    
            let params = []
    
            if(dtend && dtstart) params.push(dtstart, dtend)
            
            let pag = new Pagination(
    
                `SELECT sql_calc_found_rows * 
                FROM tb_reservations 
                ${(dtend && dtstart) ? 'WHERE date BETWEEN ? AND ?' : '' } 
                ORDER BY name LIMIT ?, ?
                `, 
                
                    params
    
            )

            pag.getPage(page).then( data => {

                s({
                    data,
                    links: pag.getNavigation(req.query) //object with the href, text, active page
                })

            })
        })
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
    },

    chart(req){
        return new Promise((s, r) =>{

            conn.query(` SELECT
            CONCAT(YEAR(date), '-', MONTH(date)) AS dateInterval,
            COUNT(*) AS total,
            SUM(people) / COUNT(*) AS avg_people
             FROM tb_reservations
            WHERE
             date BETWEEN ? AND ?
            GROUP BY dateInterval`,

            [req.query.start,
            req.query.end],
            (err, results) =>{
            if(err){
                r(err)
            } else{

                let month = [];
                let values = [];

                results.forEach(row =>{

                    month.push(moment(row.dateInterval).format('MMM YYYY'));
                    values.push(row.total)


                })

                s({
                    month, values
                })


            }})
        })
    }, 
    
    dashBoard(){
        return new Promise((s, f) =>{

            conn.query(`
            SELECT
                (SELECT COUNT(*) FROM tb_contacts) AS nrcontacts,
                (SELECT COUNT(*) FROM tb_reservations) AS nrreservations,
                (SELECT COUNT(*) FROM tb_menus) AS nrmenus,
                (SELECT COUNT(*) FROM tb_users) AS nrusers
            `
            , (err, results) =>{
                if(err){
                    f(err)
                }
                else{
                    s(results[0])
                }
            })

        })
    }

}