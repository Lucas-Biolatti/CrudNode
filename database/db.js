const mysql = require('mysql');
const conexion = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'polimetal'
})

conexion.connect((error)=>{
    if(error){
        console.error("Error:"+error);
        return
    }
    console.log("Conectado a la BD");
})
/*  host:'172.16.4.199',
    user:'lbiolatti',
    password:'diego2015',
    database:'EstacionDigital'
*/
module.exports=conexion;