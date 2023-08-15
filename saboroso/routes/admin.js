var express = require('express');
var users = require('./../inc/users');
const admin = require('../inc/admin');
var router = express.Router();


//middleware verificating if the client already did the login(if has a req.session.user), not allowing acess to all pages before a login.
router.use(function(req, res , next){

    if(["/login"].indexOf(req.url) === -1 && !req.session.user) {
        res.redirect('/admin/login')
    } else{
        next()
    }

    console.log('middleware:'+ req.url)

})

router.use(function(req, res, next){

 req.menus = admin.getMenus(req)
 next()

})

router.get('/', function(req, res, next){

    res.render('admin/index', {
        menus: req.menus

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

    res.render('admin/contacts',{
        menus: req.menus
    })
})

router.get('/menus', function(req, res, next){

    res.render('admin/menus',{
        menus: req.menus
    })
})

router.get('/reservations', function(req, res, next){

    res.render('admin/reservations',{
        date:'',
        menus: req.menus
    })
})

router.get('/users', function(req, res, next){

    res.render('admin/users', {
        menus: req.menus
    })
})
router.get('/emails', function(req, res, next){

    res.render('admin/emails',{
        menus: req.menus
    })
})


module.exports = router