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

//A partir del primer commit, todo vuelve a la normalidad, pero a medida que vamos cambiando el codigo se van activando los files donde se detecto un cambio desde el ultimo commit.... esto se ve en git status, que nos dice los files modificados. Podemos agregar con git add . y hacer el commit nuevo o tambien podemos remover estos cambios.

/////////////////////////////////////////////////////////////////////
//Lecture: Setting Up SSH Key
//HACER TODO ESTO EN LA TERMINAL GIT BASH NO POWERSHELL

// Como trasnferimos el codigo entre nuestra PC y los otros servicios como gitub? ----> SE USA SSH (Secure shell) key pair.
//Comandos: en windows se necesita el GET BASH (que se instala con git)
//1) ls nos muestra el contenido del directorio. ls -a (para q tambien se vean con hidden) ls -a -l (l facilita el formato de lectura), ls -a -l [directorio] ---> comando final: ls -a -l ~/.ssh

//Como no nos anda, empezamos manualmente:
//2) Generamos el par, con el tipo de segurar rsa y la cantidad de bits y C q es un comentario para la key como el correo:  ssh-keygen -t rsa -b 4096 -C "facundofaclchini@gmail.com"
//3) Nos preguntan algunas cosas: por defalut esta el directorio en el user profile directorio. ENter
//4)Passprahse no quremos asique enter, y luego enter otra vez para aceptar todo y finalmente s ecrea la key.
//5) Y ahora si corremos el (1) si tenemos el directorio. Sin la a xq me tira error. ---> el id_rsa NO LO COMPARTIMOS CON NADIE, ES TOP SECRET, el .pub es publico y se comparte con las app terceras como github.
//6) Finalmente lo que hacemos es asegurarnos que SE USE EL KEY LA PROXIMA VEZ QUE HAGAMOS UNA SSA CONNECTION.
//7) Para esto, hacemos que corra el programa SSH AGENT: eval $(ssh-agent) ---> AGENT PID 887
//PROBLEMA, esto fue usando powershell: No anda eval, la solucion a esto fue window + R: services.msc . Luego, OpenSSH .... properties. Automatic, Start apply OK. Y ahora si anda ssh-agent -s ---> La unica diferencia es q funciona en segundo plano y no nos da el AGENT PID.

//Y le damos la direccion del file privado
//8) LO ULTIMO: registrar el file: ssh-add ~/.ssh/id_rsa
//Y finalmente ya se agrego la identidad.

//////////////////////////////////////////////////////////////////
//Lecture: Pushing code to GitHub
//TODOS ESTOS COMANDOS TAMBIEN DESDE LA RAIZ, ES DECIR WEB-SERVER

//Una vez que ya esta la key, ya podemos empezar a compartir codigo a aplicaciones de terceros.
//En GitHub, creamos un nuevo repository (el repositorio local esta en nuestra maquina en la carpeta .git) para el proyecto y asi github tiene acceso a nuestro codigo.
//Una vez creado, lo que queremos ahcer es PUSH AN EXISTING REPOSITORY FROM THE COMMAND LINE, comandos:
//git remote add NOMBRE (origin el primero) url   ---> Este comando crea el canal de comunicacion, es como agregar un contacto al celular.
//Ahora podemos pushear a origin y mandarlo a github:
//Antes de pushear hay que darle a github la clave publica de antes SSH and GPG keys:
//Agregamos el title
//Y necesitamos el id, que es con el comando: cat ~/.ssh/id_rsa.pub
//Chequeamos la conexxion SSH: ssh -T git@github.com y colocamos yes.

//TODO ESTO DE LA SSH KEYS ETC, SOLO SE HACE UNA VEZ Y SE USA PARA TODOS LOS PROXIMOS PROYECTOS.

//FINALIZANDO EL PUSH:
//El comando: git push -u origin main pushea todos nuestros commits
