var express = require('express');
var router = express.Router();
//var que instancia a conexão com o db.
var conn = require('./../inc/db')

/* GET home page. */
router.get('/', function(req, res, next) {
  //realiazando uma query no mysql, armazenando o resultado em variaveis apresentaveis por meio de EJSTAGS no html.
  conn.query('SELECT * FROM tb_menus ORDER BY title', (err, resul) =>{

    if(err){
      console.log(err)
    }
    else{
      res.render('index', { 
        title: 'Restaurante Saboroso',
        menus: resul
       });

    }

  })
});

router.get('/contact', function(req, res, next) {
  res.render('contact',{
     title: 'Contato - Restaurante Saboroso',
     background:'images/img_bg_3.jpg',
     h1: 'Diga um oi!'
  })
})

router.get('/menu', function(req, res, next) {
  res.render('menu',{
     title: 'Menu - Restaurante Saboroso',
     background:'images/img_bg_1.jpg',
     h1: 'Saboreie o nosso menu!'
  })
})

router.get('/reservation', function(req, res, next) {
  res.render('reservation',{
     title: 'Reservas - Restaurante Saboroso',
     background:'images/img_bg_2.jpg',
     h1: 'Reserve um Mesa!'
  })
})

router.get('/services', function(req, res, next) {
  res.render('services',{
     title: 'Serviços - Restaurante Saboroso',
     background:'images/img_bg_1.jpg',
     h1: 'É um prazer poder servir!'
  })
})

module.exports = router;
