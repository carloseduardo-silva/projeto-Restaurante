var express = require('express');
var router = express.Router();
var menus = require('./../inc/menus')
var conn = require('./../inc/db')
var reservation = require('./../inc/reservation')
var contact = require('./../inc/contact')
var email = require('./../inc/emails');
const emails = require('./../inc/emails');

/* GET home page. */

module.exports = function(io){

  router.get('/', function(req, res, next) {
    menus.getMenus().then(results =>{
      res.render('index', { 
        title: 'Restaurante Saboroso',
        menus: results,
        isHome: true
       });

    })
});

router.get('/contact', function(req, res, next) {
    contact.render(res, req)
})

router.post('/contact', function(req, res, next) {


    if(!req.body.name){
      contact.render(res, req, 'Digite o Nome!')
    }else if(!req.body.email){
      contact.render(res, req, 'Digite o Email!')
    }else if(!req.body.message){
      contact.render(res, req, 'Digite algo!')
    } else{
       contact.save(req.body).then(result =>{

        req.body = {}

        contact.render(res, req, null, 'Mensagem enviada com sucesso!')
        io.emit('dashboard update')
      }).catch(err =>{
        contact.render(res, req, err.message)
      })

    }
})

router.get('/menu', function(req, res, next) {

  menus.getMenus().then(results =>{

    res.render('menu',{
       title: 'Menu - Restaurante Saboroso',
       background:'images/img_bg_1.jpg',
       h1: 'Saboreie o nosso menu!',
       menus: results,
       isHome: false
    })

  })

})

router.get('/reservation', function(req, res, next) {

  reservation.render(req, res)

})

router.post('/reservation', function(req, res, next) {
  //receiving datas from forms that has the route '/reservation' and method='post', rightafter validating those datas and sending then to the mysql
  if(!req.body.name){
    reservation.render(req, res, 'Digite o nome!')
    
  }else if(!req.body.email){
    reservation.render(req, res, 'Digite o email !')

  }else if(!req.body.people){
    reservation.render(req, res, 'Selecione o numero de pessoas !')

  }else if(!req.body.date){
    reservation.render(req, res, 'Selecione a data !')

  }else if(!req.body.time){
    reservation.render(req, res, 'Selecione a hora !')
   
  } 
  else {
    reservation.save(req.body).then(result =>{

      req.body = {}

      reservation.render(req, res, null, 'Reserva realizada com sucesso!')
      io.emit('dashboard update')
    }).catch(err =>{
      reservation.render(req, res, err.message)
    })
  }
  

})

router.get('/services', function(req, res, next) {
  res.render('services',{
     title: 'Serviços - Restaurante Saboroso',
     background:'images/img_bg_1.jpg',
     h1: 'É um prazer poder servir!',
     isHome: false
  })
})

router.post('/subscribe', function(req, res, next) {

  console.log(req.fields.email)

  emails.save(req).then(results=>{

    res.send(results)
    io.emit('dashboard update')

  }).catch(err=>{

    res.send(err)

  });
  });


  return router
}
