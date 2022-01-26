const express = require('express');
const router = express.Router();
const pug = require('pug');
const conexion = require('./database/db');
const url = require('url');

//Manejo de vistas
router.get('/',(req,res)=>{
    let sql1 = "SELECT * FROM sector";
    let sector = [];
    
    conexion.query(sql1,(error,result,files)=>{
        if(!error){
           
            for(let i=0;i<result.length;i++){
                sector.push(result[i])
            }
         
        }
    
    res.render("inicio",{sector:sector});    
    })
})
router.get('/mtto',(req,res)=>{
    let sql1 = "SELECT * FROM sector";
    let sector = [];
    
    conexion.query(sql1,(error,result,files)=>{
        if(!error){
           
            for(let i=0;i<result.length;i++){
                sector.push(result[i])
            }
         
        }
    
    res.render("mtto",{sector:sector});    
    })
})
router.get('/newOrder',(req,res)=>{
    let idSector = url.parse(req.url,true).query.id;
    let sql2 = "SELECT * FROM equipo WHERE Sector=?";
    let equipo = [];
    conexion.query(sql2,[parseInt(idSector)],(error,result,files)=>{
        if(!error){
           
            for(let i=0;i<result.length;i++){
                equipo.push(result[i])
            }
            res.render('newOrder',{equipo:equipo,idSector:idSector});
        }
  
    })
}) 
router.get('/accident',(req,res)=>{
    let idSector = url.parse(req.url,true).query.id;
   
            res.render('accident',{idSector:idSector});
        }
  ) 
router.get('/actosInseguros',(req,res)=>{
    let idSector = url.parse(req.url,true).query.id;
   
            res.render('actosInseguros',{idSector:idSector});
        }
)
router.get('/seguridad',(req,res)=>{
    let sql1 = "SELECT * FROM sector";
    let sector = [];
    
    conexion.query(sql1,(error,result,files)=>{
        if(!error){
           
            for(let i=0;i<result.length;i++){
                sector.push(result[i])
            }
         
        }
    
    res.render("seguridad",{sector:sector});    
    })
})
router.get('/listAccident',(req,res)=>{
    const sql = "SELECT * FROM `accidentes` WHERE 1";
    conexion.query(sql,(error,result,files)=>{
        
        let resultados=[];
        for(let i=0;i<result.length;i++){
            let f = new Date(result[i].fecha);
            let fecha = f.getDate()+"/"+f.getMonth()+"/"+f.getUTCFullYear();
            
            let resultado={
                idAccidente:result[i].idAccidente,
                nombre:result[i].nombre,
                fecha:fecha,
                tipo:result[i].tipo,
                que:result[i].que,
                cuando:result[i].cuando,
                donde:result[i].donde,
                quien:result[i].quien,
                cual:result[i].cual,
                como:result[i].como,
                observaciones:result[i].observaciones,
                sector:result[i].sector

            }
            resultados.push(resultado);
        }
        res.render("listAccident",{accidentes:resultados});
    })
})
router.get('/listActos',(req,res)=>{
    const sql = "SELECT * FROM `actosinseguros` WHERE 1";
    conexion.query(sql,(error,result,files)=>{

        
        if(!error){
            let resultados=[];
            for(let i=0;i<result.length;i++){
                let f = new Date(result[i].fecha);
                let fecha = f.getDate()+"/"+f.getMonth()+"/"+f.getUTCFullYear();
                let resultado={
                    idActoInseguro:result[i].idActoInseguro,
                    observador:result[i].nombre,
                    sector:result[i].sector,
                    fecha:fecha,
                    tipo:result[i].tipo,
                    subTipo:result[i].subTipo,
                    descripcion:result[i].descripcion,
                    propuesta:result[i].propuesta,
                    accion:result[i].accion
                }
                resultados.push(resultado)
            }
            res.render("listIncident",{actosInseguros:resultados});
        }else{
            console.log(error)
        }
    })
})
router.get('/resolverOrden',(req,res)=>{
    res.render('./vistasmtto/resolverOrden')
})

//Invocar js de metodos
const crud = require('./controllers/crud');
const { resourceLimits } = require('worker_threads');

//Guardar Orden de Trabajo
router.post('/guardar',crud.add);

//Guardar Reporte de accidente
router.post('/addAccident',crud.addAccident);

router.post('/addIncident',crud.addIncident);

router.get('/buscarOrden',crud.serchOrder);

router.get('/editOrder',crud.editOrder);

router.post('/updateOrder',crud.edit);

router.get('/editAccidente',crud.editAccident);
module.exports=router;


