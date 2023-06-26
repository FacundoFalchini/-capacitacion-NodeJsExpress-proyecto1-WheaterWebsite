//Primero npm init -y
//Segundo npm i express
//Cada vez que hacemos un cambio y queremos que se aplique al server es cortarlo y volverlo a abrir o usamos nodemon: nodemon src/app.js

const path = require("path"); //Es core, no es necesario instalarlo. Este paquete facilita trabajar con el string de las rutas
const express = require("express");

const hbs = require("hbs");

//Express es solamente una funcion. No recibe parametros, sino que la web app se configura con los metodos.
const app = express();
const port = process.env.PORT || 3000;

/* 
Instalar require xq aca no esta 
const geocode = require('./utils/geocode)
const forecast = require('./utiles/forecast')
*/

//console.log(__dirname); //Nos da la ruta del directorio donde estamos
//onsole.log(path.join(__dirname, "../public")); //Subimos a la carpeta web-server y entramos al directorio public
//console.log(__filename); //Nos da la ruta del archivo donde estamos.

//Por default, al entrar (al puerto 3000), lo que se genera es lo que esta en la direccion que le pasamos a static, que es el html.
//TODO LO QUE SE QUIERA DESPLEGAR EN EL BUSCADOR, TIENE QUE ESTAR EN EL PUBLIC FOLDER PORQUE ES EL UNICO DIRECTORIO QUE ESTA EXPUERTO PARA EL WEB SERVER.
//Static justamente significa que nada cambiara, todo lo contrario a una pagina dinamica ---> para esto podemos usar un template engine como HANDLERBARS (nos permite renderizar documentos dinamicos y crear facilmente codigo que podemos reutilizar en diferentes paginas).
//Tambien esta handlebars para usar con el servidor Express, que hay una liberia tambien que basicamente integra handlebars a express. El nombre: hbs: npm install hbs@4.0.1

//DEFINIENDO HANDLEBARS ENGINE Y VIEWS LOCATION:
app.set("views", path.join(__dirname, "../templates/views")); //Esta linea es necesaria porque el motor de vistas busca las plantillas en el directorio que le especifiquemos. En nuestro caso es el motor de vistas hbs y quiere que busque en el directorio views. La linea con public solo se encarga de servir archivos ESTATICOS (css, imagenes o js). Estamos en src ---> .. vamos a web server y de ahi a la carpeta templates y ahi a la carpete views
app.set("view engine", "hbs");

//DEFINIENDO EL DIRECTORIO PARA LAS PARTIALS:
hbs.registerPartials(path.join(__dirname, "../templates/partials"));

//DEFINIENDO EL DIRECTORIO ESTATICO
app.use(express.static(path.join(__dirname, "../public")));

//Para que se vea la view desde el navegador, hay que establecer la ruta. Ahora en lugar de send, queremos renderizar la view.
//RENDERIZADOS DE LAS VISTAS

app.get("", (req, res) => {
  //Se le pasa el NOMBRE y render automaticamente ira a la carpeta que se le seteo en app.set que es views y encuentra la vista (HTML COMPLETO) a renderizar
  //Se le pasa luego un objeto donde cada propiedad coincide en nombres coinciden con elementos que estan en los templates PARCIALES, es decir que esos parciales los usamos a lo largo de diferentes vistas, y cada vista al renderizarse usa esos parciales, pero tiene su propio title y su propio name
  res.render("index", {
    title: "Weather",
    name: "Targaryen Facundo II",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Me",
    name: "Targaryen Facundo II",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help",
    name: "Targaryen Facundo II",
  });
});

//TODO SOBRE QUERY STRINGS Y CREANDO A JSON HTTP ENDPOINT: encargado de mandar devuelta la JASON Forecast information al navegador
//Si queremos implementar algo de busqueda, hay que usar un queryString (estan al final del URL, empeizan con ? y se dan pares de key/value key=value  , ejemplo products?search=games). Y como nostros creamos el back end, podemos ver que query strings queremos soportar y cuales no... y CUANTAS, si queremos mas se pueden ir concatenando & ---> search=games&rating=5
//Esta data la tenemos en REQUEST !!!! El req.query obtenemos estos valores de opciones

app.get("/weather", (req, res) => {
  //Esto se corre solamente cuando NO SE PROVEE EL ADRESSS en el query.
  //HAY QUE AGREGAR EL RETURN PORQUE SOLAMENTE SE PUEDE HACER UN SEND, asi no se corre el send debajo.
  if (!req.query.address) {
    return res.send({
      error: "You must provide an Address",
    });
  }

  /* 
Le agregamos en la descontruction un objeto vacio por default caso que no se pase el valor de address y se intente destructurar undefined. Entonces, error se provee porque es un error, y entonces la otra funcion de sucess no se le pasa nada... pero se intenta de todas maneras hacer la destructuracion... entonces para evitar este error hay que agregar el valor por default. En estos casos, las 3 latitude, longitude y location van a ser undefined, pero no nos importa porque el unico codigo que corre es el del error. 

geocode(req.query.addres, (error,{latitude,longitude,location} = {})=>{
  if(error){
    return res.send({error: error})
  }
  })

  forecast(latitude,longitude, (error, forecastData)=>{
    if(error){
      return res.send({error:error})
    }
  })

  //Esto solo se envia si fue todo exitoso
  res.send({
    forecast: forecastData
    location,
    address: req.query.address
  })

*/

  //Si hay address mandamos un objeto (static json)
  res.send({
    forecast: "It is snowing",
    location: "philadelphia",
    address: req.query.address,

    //ACA EN REALIDAD HAY QUE MANDAR DATA DEVUELTA AL BUSCADOR, DATA UTIL... TODO LO HECHO EN GEOCODE Y FORECAST CON LAS API QUE NO PUDE USAR XQ AHORA SON PINCHE PAGAS!!!!
  });
});

//Ej de URL: http://localhost:3000/weather?address=SantaFe

//RENDERIZADO DE LAS VISTAS DE ERROR:

//En ambos get necesitamos proveer (1 y 2 para los partials y 3 para el msg que comparten ambas vistas de error, que renderiza el mismo html pero cambia este msg):
// 1) TITLE porque lo usa el header.
// 2) NAME porque lo usa el footer.
// 3) Un valor para el errorMessage

//Si el usuario llega a esta parte es porque quiere ayuda nomas que despues le erro y podemos dar un error en referencia a help y no directamente el 404.
app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Facundo Falchini",
    errorMessage: "Help articule not found",
  });
});

//404 PAGES, el * es todo lo que no sean opciones validas
//Este GET tiene que ir al FINAL de todos los otros get. Cuando express recibe un pedido empieza a buscar el match en order... primero ira al publico... luego al get de la raiz... luego al de about, luego al de help y asi hasta hacer el match. Si llega al * TODO ES UN MATCH y entonces, si esta al principio.. todo ya sea help o about van hacer match con esta pagina y no lo queremos.
app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Facundo Falchini",
    errorMessage: "Page not found.",
  });
});

//Y falta activar el server, y se le pasa algun puerto. Y tambien se le pasa una callback cuando el server esta corriendo.
//Hay puertos default dependiendo la funcion
app.listen(port, () => {
  console.log("Server is up on port " + port);
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//FUNCIONAMIENTO DEL APP.GET

//El server es unico, pero tenemos diferentes RUTAS
// app.com
// app.com/help
// app.com/about

//Y con get recibe 2 parametros:
//  * El primero es la ruta (url parcial), nada en el promer, /help o /about.
//  * El segundo es una funcion, que es lo que hacemos cuando se visita la ruta que se pasa primero.
//          Esta funcion tiene 2 argumentos:
//                                            * El primero (req) es un objeto con la informacion requerida al server
//                                            * El segundo (res) es la respuesta, que es lo que le devolvemos al que solicita.

//No se suele mandar un simple mensaje, sino que se manda:
// 1) HTML para que sea renderizado en el buscador.
// 2) JSON para ser consumido y usado por codigo.

//Ya no se necesitan todos estos get, dado que implementamos el STATIC DIRECTORY donde podemos poner todos los assets que van a formar a nuestra web!
//Ahora accedemos con localhost:3000/help.html

/*
app.get("", (req, res) => {
  //Send nos permite mandar algo devuelta al que solicita.
  //res.send("Hello express!"); //Esto se despliega en el browser
  res.send("<h1>Weather</h1>"); //HTML
});
*/

//Ahora la respuesta a esta URL:

/*
app.get("/help", (req, res) => {
  //Send nos permite mandar algo devuelta al que solicita.
  //res.send("No tenemos ayudas para vos, BURRO"); //Esto se despliega en el browser

  //DATA: automaticamente si es objeto o array, se  aplica el stringlyfy
  res.send({
    name: "Facundo",
    age: 27,
  });
});
*/

//En la consola node src/app.js  (PORQUE NO ESTA EN LA RAIZ)
//No se habilita la consola hasta que cortemos el sv... porque es su funcion correr todo el tiempo ---> CTR + C
//Y para buscarlo en el localhost:3000
//Y para buscarlo en el localhost:3000/help

////////////////////////////////////////////////////
//Lecture: Browser HTTP Request with FETCH

//Como hacer una request HTTP para la data del clima desde el clientede JV en el BUSCADOR.
