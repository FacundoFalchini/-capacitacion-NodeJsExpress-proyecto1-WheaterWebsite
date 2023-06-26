console.log("Client side javascript file is loaded!");

//FETCH SE USA CUANDO ESTAMOS EN EL LADO DEL CLIENTE, MIENTRAS QUE EL OBJETIVO DE ESTE CURSO ES EL LADO DEL SERVIDOR CON NODE.JS
//Para hacer la request http from client side JS, se usa FETCH que es una API ajena.
//Obtenemos (fecth) Json DATA de alguna URL, se hace el parse en un objeto de JS y hacer algo.
/*
fetch("http://puzzle.mead.io/puzzle").then((response) => {
  response.json().then((data) => {
    console.log(data);
  });
});
*/

const weatherForm = document.querySelector("form");
const search = document.querySelector("input");
const messageOne = document.querySelector("#message-1");
const messageTwo = document.querySelector("#message-2");

weatherForm.addEventListener("submit", (e) => {
  e.preventDefault();
  //Obtenemos la locacion que ingresa el usuario, y ahora usamos esto para generar la URL q se le pasa a fecth
  const location = search.value;

  messageOne.textContent = "Loading...";
  messageTwo.textContent = "";

  //Ahora lo mismo, pero con nuestra web ---> Al obtener esta data, ahora la podemos RENDERIZAR EN PANTALLA.
  fetch(`http://localhost:3000/weather?address=${location}`).then(
    (response) => {
      response.json().then((data) => {
        if (data.error) {
          messageOne.textContent = data.error;
          //console.log(data.error);
        } else {
          //console.log(data);
          messageOne.textContent = data.location;
          messageTwo.textContent = data.forecast;
        }
      });
    }
  );
});

//HEROKU CLI: Nos da acceso a los comandos Heroku
//Desde la terminal sin accder a ninguancarpeta: hacemos heroku login

//GIT: Version Control ---> Permite manejar las versiones del codigo a lo largo del tiempo, podemos crear save point para las diferentes versiones de nuestra APP.
//Comandos GIT:
//Para ver si esta bien instalado: git --version

//1) Comando para inicializar GIT en el proyect folder. Se inicializa GIT en CADA PROYECTO que querramos usarlo. En este caso es WEB-SERVER el folder. ---> GIT INIT

//GIT no agrega automaticamente los files, sino que hay que agregarlos, estos se clasifican como UNTRACKED FILES.
//Todo lo que querramos salvar (COMMIT), hay que ponerlos en estado STAGED CHANGES (esto es, poner esos files con ADD)
//El COMMIT se crea con el comando commit, toda todos los files en staged changes y los une a todos en un unico commit que tiene su propio identificador.
//Luego, si hay algun cambio en algun file que es untracked y este lo usamos en algun file que ya esta en commit, este file va a Unstaged Changes, estos ambos archivos hay que agregarlos a staged con ADD y luego hacemos otro nuevo commit.

//1) GIT INIT (Desde el proyect folder, web server)
//2) GIT STATUS (Nos da el estado de cada file, en un principio todos estan como Untracked files). Node modules NO QUEREMOS trackearlo, dado que este se genera solo con npm install usando la data de los json, no es necesario mantenerlo. Lo agregamos en gitignore
//3) GIT ADD src/ (podemos listar asi los directorios 1 por 1), y para agregar todo es GIT ADD .
//4) GIT COMMIT -m "Initial Commit".
//Comentarios para probar un segundo commit
