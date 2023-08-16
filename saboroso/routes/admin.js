var express = require('express');
var users = require('./../inc/users');
const admin = require('../inc/admin');
var router = express.Router();
var menus = require('.././inc/menus');



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

            req.session.user = user;
            res.redirect('/admin')

        }).catch(err =>{
            users.render(res, req, err.message || err)
        })
    }
    

})

router.get('/login', function(req, res, next){

    users.render(res, req , null)
})

router.get('/contacts', function(req, res, next){

    res.render('admin/contacts',  admin.getParams(req))
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
    

    console.log(typeof(req.files.photo))
   admin.postMenus(req.fields, req.files).then(results =>{

        res.send(results)
        

    }).catch(err =>{
       res.send(err)
    })
   
  


})

router.get('/reservations', function(req, res, next){

    res.render('admin/reservations',  admin.getParams(req, {
        date: ''
    }))
})

router.get('/users', function(req, res, next){

    res.render('admin/users',  admin.getParams(req))
})
router.get('/emails', function(req, res, next){

    res.render('admin/emails',  admin.getParams(req))
})


module.exports = router