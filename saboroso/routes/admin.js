var express = require('express');
var users = require('./../inc/users');
var admin = require('../inc/admin');
var router = express.Router();
var menus = require('.././inc/menus');
var reservation = require('../inc/reservation');
var contact = require('.././inc/contact')
var moment = require('moment')
var emails = require('../inc/emails')

moment.locale('pt-br')


//middleware verificating if the client already did the login(if has a req.session.user), not allowing acess to all pages before a login.
router.use(function(req, res , next){

    if(["/login"].indexOf(req.url) === -1 && !req.session.user) {
        res.redirect('/admin/login')
    } else{
        next()
    }

    

})

router.use(function(req, res, next){

 req.menus = admin.getMenus(req)
 next()

})

router.get('/', function(req, res, next){

    admin.dashBoard().then(result =>{
        let datas = {
            contatos:result.nrcontacts,
            menu: result.nrmenus,
            usersNumber: result.nrusers,
            reservas: result.nrreservations 
        }
        
        res.render('admin/index',  admin.getParams(req, datas))

    }).catch(err =>{
        console.log(err)
    })

})

router.get('/logout', function(req, res, next){

    delete req.session.user;

    res.redirect('/admin/login')

})

router.post('/login', function(req, res, next){

    if(!req.body.email){
        users.render(res, req,"Preencha o campo email!")
    }   
    else if(!req.body.password){
        users.render(res, req,"Preencha o campo senha!")
    } 
    else{
        users.login(req.body.email, req.body.password).then(user =>{

            console.log(user)
            req.session.user = user;
            res.redirect('/admin')

        }).catch(err =>{
            console.log('error')
            users.render(res, req, err.message || err)
        })
    }
    

})

router.get('/login', function(req, res, next){

    users.render(res, req , null)
})

router.get('/contacts', function(req, res, next){

    contact.getContacts().then(data =>{

        res.render('admin/contacts',  admin.getParams(req, {
            data
        }))

    })

})

router.delete('/contacts/:id', function(req, res, next){

    contact.excludeContact(req.params.id).then(result =>{

        res.send(result)

    }).catch(err =>{

        res.send(err)

    })

})



router.get('/menus', function(req, res, next){
    
    menus.getMenus().then(data =>{

        res.render('admin/menus',  admin.getParams(req, {
            data
        }))

    })

})

router.post('/menus', function(req, res, next){

    //fix sending the original filename from req.files to the mysql.
    //typeof req.files.photo = object
    
   menus.postMenus(req.fields, req.files).then(results =>{
        
        res.send(results)
        

    }).catch(err =>{
       res.send(err)
    })
   
  


})

//req.params it is the var declarated(:) righafter the ':' in the route way
router.delete('/menus/:id', function(req, res, next){

    menus.excludeMenu(req.params.id).then(result =>{

        res.send(result)

    }).catch(err =>{

        res.send(err)

    })

})

router.get('/reservations', function(req, res, next){

    let start = (req.query.start) ? req.query.start : moment().subtract(1, 'year').format('YYYY-MM-DD')

    let end = (req.query.end) ? req.query.end : moment().subtract(1, 'year').format('YYYY-MM-DD')

    reservation.getReservations(req).then(pag =>{

        res.render('admin/reservations',  admin.getParams(req, {
            
            date: {
                start,
                end
            },
            data: pag.data,
            moment,
            links: pag.links
        }))

    })

})

router.get('/reservations/chart', function(req, res, next){

    req.query.start = (req.query.start) ? req.query.start : moment().subtract(1, 'year').format('YYYY-MM-DD')

    req.query.end = (req.query.end) ? req.query.end : moment().subtract(1, 'year').format('YYYY-MM-DD')

   reservation.chart(req).then(chartData =>{
    res.send(chartData)
   })

})


router.post('/reservations', function(req, res, next){


    reservation.save(req.fields, req.files).then(result =>{

        res.send(result)

    }).catch(err =>{

        res.send(err)
    })


})

router.delete('/reservations/:id', function(req, res, next){

    reservation.excludeReservation(req.params.id).then(result =>{

        res.send(result)

    }).catch(err =>{

        res.send(err)

    })

})

router.get('/users', function(req, res, next){

    users.getUsers().then(data =>{

        res.render('admin/users',  admin.getParams(req, {
            data
        }))

    })

})

router.post('/users', function(req, res, next){


    users.save(req.fields).then(result =>{

        res.send(result)

    }).catch(err =>{

        res.send(err)
    })


})

router.post('/users/password-change', function(req, res, next){


    users.changePassword(req.fields).then(result =>{

        res.send(result)

    }).catch(err =>{

        res.send({
            error: err
        })
    })


})

router.delete('/users/:id', function(req, res, next){

    users.excludeUser(req.params.id).then(result =>{

        res.send(result)

    }).catch(err =>{

        res.send(err)

    })

})

router.get('/emails', function(req, res, next){

    emails.getEmail().then(data =>{
        
        res.render('admin/emails',  admin.getParams(req, {
            data}))

    })

})

router.delete('/emails/:id', function(req, res, next){

    emails.excludeEmail(req.params.id).then(result =>{

        res.send(result)

    }).catch(err =>{

        res.send(err)

    })

})



module.exports = router