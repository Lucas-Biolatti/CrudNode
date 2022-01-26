const conexion = require('../database/db');
const formidable = require('formidable');
const url = require('url');
//Inserts
exports.add = (req,res)=>{

    let form = new formidable.IncomingForm();
    form.parse(req,(error,fields,files)=>{
        if(!error){
            let sql = "INSERT INTO `ordentrabajo`(`detecto`, `sector`, `equipo`, `fecha`, `turno`, `paradaProceso`, `prioridad`, `tipoParada`, `horaInicio`, `horaFin`, `descripcion`) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
             conexion.query(sql,[fields.detecto,parseInt(fields.idSector),fields.equipo,fields.fecha,fields.turno,fields.paradaProceso,fields.prioridad,fields.tipoParada,fields.horaInicio,fields.horaFin,fields.descripcion],(error,rows,files)=>{
                
                if(!error){
                    console.log("Se Guardo la orden Correctamente");
                    res.render("confirm");
                }else{
                    console.log(error);
                }
            })
            
        }
    })
    
}
exports.addAccident = (req,res)=>{
    let form = new formidable.IncomingForm();
    let sql = "INSERT INTO `accidentes`( `nombre`, `fecha`, `tipo`, `que`, `cuando`, `donde`, `quien`, `cual`, `como`, `observaciones`, `sector`) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
    form.parse(req,(error,field,file)=>{
        if(!error){
        conexion.query(sql,[field.nombre,field.fecha,field.tipo,field.que,field.cuando,field.donde,field.quien,field.cual,field.como,field.observacion,parseInt(field.idSector)],(error,row,file)=>{
            console.log(field);
           
            if(!error){
            
            res.redirect('confirm.pug');
            
            }
            else{
               
                console.log(error);
            }
        })
        }
    })
}
exports.addIncident = (req,res)=>{
    let form = new formidable.IncomingForm();
    let sql = "INSERT INTO `actosinseguros`(`nombre`, `fecha`, `tipo`, `subTipo`, `descripcion`, `propuesta`, `accion`, `sector`) VALUES (?,?,?,?,?,?,?,?)";
    form.parse(req,(error,field,file)=>{
        if(!error){
        conexion.query(sql,[field.nombre,field.fecha,field.tipo,field.subtipo,field.descripcion,field.propuesta,field.accion,parseInt(field.idSector)],(error,row,file)=>{
            console.log(field);
           
            if(!error){
            
            res.render('confirm');
            
            }
            else{
               
                console.log(error);
            }
        })
        }
    })
}

//Listados
exports.serchOrder = (req,res)=>{
    let idSector = url.parse(req.url,true).query.id;
    let sql1 = "SELECT * FROM ordentrabajo WHERE sector=?";
    
    conexion.query(sql1,[parseInt(idSector)],(error,result,files)=>{
        if(!error){
            let resultados=[];
            for(let i=0;i<result.length;i++){
            let f = new Date(result[i].fecha);
            let fecha = f.getDate()+"/"+f.getMonth()+1+"/"+f.getUTCFullYear();
            let finicio  = new Date(result[i].horaInicio);
            let ffin  = new Date(result[i].horaFin);
            let inicio=finicio.getDate()+"/"+finicio.getMonth()+"/"+finicio.getUTCFullYear()+" - "+finicio.getHours()+":"+finicio.getMinutes();
            let fin=ffin.getDate()+"/"+ffin.getMonth()+"/"+ffin.getUTCFullYear()+" - "+ffin.getHours()+":"+ffin.getMinutes();
            let resultado={
                idOrden: result[i].idOrden,
                detecto: result[i].detecto,
                equipo: result[i].equipo,
                fecha: fecha,
                turno: result[i].turno,
                paradaProceso: result[i].paradaProceso,
                prioridad: result[i].prioridad,
                tipo: result[i].tipoParada,
                horaInicio: inicio,
                horaFin: fin,
                descripcion:  result[i].descripcion,
                tiempoTotal:(ffin-finicio)/1000/60,
            }
            resultados.push(resultado);
        }
            res.render('verOrden',{orden:resultados,idSector:parseInt(idSector)});
         }
        else{
            console.log("Error de conexion");
        }
    })
}

//Edits
exports.editOrder = (req,res)=>{
    let idOrden = url.parse(req.url,true).query.idOrden;
    let idSector = url.parse(req.url,true).query.idSector;

    let sql2 = "SELECT * FROM equipo WHERE Sector=?";
    let equipo = [];
    conexion.query(sql2,[parseInt(idSector)],(error,result,files)=>{
        if(!error){
            for(let i=0;i<result.length;i++){
                equipo.push(result[i])
            }
        }
    })

    let sql = "SELECT * FROM `ordentrabajo` WHERE `idOrden`=?";
    conexion.query(sql,[parseInt(idOrden)],(error,result,file)=>{
        if(!error){
        let dia = (result[0].fecha.getUTCDate()<10?'0':'')+result[0].fecha.getUTCDate();
        let mes = ((result[0].fecha.getMonth()+1)<10?'0':'')+(result[0].fecha.getMonth()+1);
        let f = result[0].fecha.getUTCFullYear()+"-"+mes+"-"+dia;
        
        res.render('editOrder',{
            result:result,
            idSector:idSector,
            idOrden:idOrden,
            equipo:equipo,
            f:f});
        }
    })
   
    }

exports.edit = (req,res)=>{
    
    let form=new formidable.IncomingForm();
    form.parse(req,(error,results,files)=>{
        
        if(!error){
        let sqlupdate = "UPDATE `ordentrabajo` SET `detecto`=?,`equipo`=?,`fecha`=?,`turno`=?,`paradaProceso`=?,`prioridad`=?,`tipoParada`=?,`horaInicio`=?,`horaFin`=?,`descripcion`=? WHERE `idOrden`=?";
        let resultados = [
            results.detecto,
            results.equipo,
            results.fecha,
            results.turno,
            results.paradaProceso,
            results.prioridad,
            results.tipoParada,
            results.horaInicio,
            results.horaFin,
            results.descripcion,
            parseInt(results.idOrden),
            
        ];
        
        conexion.query(sqlupdate,resultados,(error,rows)=>{
            if(!error){
            console.log("se modifico correctamente");
            res.redirect("mtto")
            }else{
                console.log(error);
            }
        })
    }else{
        console.log("No se pudo modificar"+error)
    }


    })

}

exports.editAccident = (req,res)=>{
    let idAccidente=url.parse(req.url,true).query.idAccidente;
    let idSector=url.parse(req.url,true).query.idSector;
    
    const sql="select * FROM accidentes WHERE idAccidente=?"
    conexion.query(sql,[idAccidente],(error,result,files)=>{
        if(!error){
            let dia = (result[0].fecha.getUTCDate()<10?'0':'')+result[0].fecha.getUTCDate();
            let mes = ((result[0].fecha.getMonth()+1)<10?'0':'')+(result[0].fecha.getMonth()+1);
            let f = result[0].fecha.getUTCFullYear()+"-"+mes+"-"+dia;
            res.render('editAccident',{result:result,idAccidente:idAccidente,idSector:idSector,fecha:f});        
        }

    })
    
}