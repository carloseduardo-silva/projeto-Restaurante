var path = require('path')

var conn = require('./db')

module.exports = {

    dashBoard(){

        return new Promise((s, f) =>{
            conn.query(`
            SELECT
            (SELECT COUNT(*) FROM tb_contacts) AS nrcontacts,
            (SELECT COUNT(*) FROM tb_menus) AS nrmenus,
            (SELECT COUNT(*) FROM tb_reservations) AS nrreservations,
            (SELECT COUNT(*) FROM tb_users) AS nrusers;`, (err, results)=>{
                if(err){
                    f(err)
                } else{
                    s(results[0])
                }
            })

        })

    },


    getParams(req, params){

        return Object.assign({}, {
            menus: req.menus,
            user: req.session.user
        }, params)

    },


    postMenus(data, files){

        return new Promise((s, f) =>{

            

            data.photo = `images/${files.photo}`



            conn.query(`
            INSERT INTO tb_menus (title, description, price, photo)
            VALUES (?, ?, ?, ?)`, 
            [
                
                data.title,
                data.description,
                data.price,
                data.photo
            ], (err, results) => {
    
                if(err){
                    f(err)
                }
                else{
                    s(results)
                }
    
            })
        })


    },


    getMenus(req){

        let menus = [
            {
                text: 'Tela inicial',
                href: '/admin/',
                icon:'home',
                active:false
            },
            {
                text: 'Menu',
                href: '/admin/menus',
                icon:'cutlery',
                active:false
            },
            {
                text: 'Reservas',
                href: '/admin/reservations',
                icon:'calendar-check-o',
                active:false
            },
            {
                text: 'Contatos',
                href: '/admin/contacts',
                icon:'comments',
                active:false
            },
            {
                text: 'Users',
                href: '/admin/users',
                icon:'users',
                active:false
            },
            {
                text: 'E-mails',
                href: '/admin/emails',
                icon:'envelope',
                active:false
            }
        ]

        menus.map(menu =>{

            if(menu.href === `admin/${req.url}`){
                menu.active = true
            }

            console.log(req.url , menu.href)

        })
        
        return menus
    }

    
}