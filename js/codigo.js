const URL_BASE = "https://babytracker.develotion.com/"
const MENU = document.querySelector("#menu");
const ROUTER = document.querySelector("#ruteo");
const HOME = document.querySelector("#pantalla-home");
const LOGIN = document.querySelector("#pantalla-login");
const REGISTRO = document.querySelector("#pantalla-registro");
const EVENTOS = document.querySelector("#pantalla-eventos");
const L_EVENTOS = document.querySelector("#pantalla-listeventos");
const INFORME = document.querySelector("#pantalla-informe");
const PLAZAS = document.querySelector("#pantalla-plazas");



const NAV = document.querySelector("ion-nav");

const loading = document.createElement('ion-loading');


function Loading(texto) {
    loading.cssClass = 'my-custom-class';
    loading.message = texto;
    document.body.appendChild(loading);
    loading.present();
}



inicio()


function inicio(){
    crearMenu()
    eventos()
}

function eventos(){
    ROUTER.addEventListener('ionRouteDidChange', navegar);
    document.querySelector("#slcDepartamento").addEventListener("ionChange", cargarCiudades)

}


// usuario.usuario = "elNoba"
//     usuario.password = "FlorencioVarela"
//     usuario.idDepartamento = 1;
//     usuario.idCiudad = 1;

function registro() {
    let usuario = new Object();
    usuario.usuario = document.querySelector("#registroUsuario").value;
    usuario.password = document.querySelector("#registroPassword").value;
    usuario.idDepartamento = document.querySelector("#slcDepartamento").value;
    usuario.idCiudad = document.querySelector("#slcCiudad").value;

    if (!usuario.usuario || !usuario.password || !usuario.idDepartamento || !usuario.idCiudad) {
        MostrarToast("Todos los campos deben estar completos.", 3500)
    } else {
        fetch(URL_BASE + 'usuarios.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario)
        }).then(function (response) {
            console.log(response);
    
            if (response.ok) {
                MostrarToast("Registro completado", 3500)
                REGISTRO.style.display = "none";
                LOGIN.style.display = "block";
            } else {
                MostrarToast("Usuario ya existe", 3500)
            }
        })
    }
 
}

function login(){
    let usuario = new Object();
    usuario.usuario = document.querySelector("#loginUsuario").value;
    usuario.password = document.querySelector("#loginPassword").value;
    Loading("Iniciando sesión");


    fetch(URL_BASE + 'login.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuario)
    }).then(function (response) {
        console.log(response);

        if (response.ok) {
            return response.json();
        } else {
            loading.dismiss();
            Alertar("Error", "Usuario/Contraseña incorrecta", "")
            console.log(response)
        }
    }).then(function (data) {
        console.log(data);
        localStorage.setItem("apiKey", data.apiKey)
        localStorage.setItem("idUsuario", data.id)

        loading.dismiss();
        // crearMenu()
        MostrarToast("¡Sesión iniciada con éxito!", 3500)
        crearMenu()
        listEventos()
        LOGIN.style.display = "none";
        L_EVENTOS.style.display = "block";

    })
}



function navegar(evt) {
    ocultarPantallas();
    let ruta = evt.detail.to;
    console.log(ruta)

    if (ruta == "/") {
        HOME.style.display = "block";

    } else if (ruta == "/login") {
        LOGIN.style.display = "block";

    } else if (ruta == "/registro") {
        REGISTRO.style.display = "block";
        cargarDepartamentos()

    } else if (ruta == "/eventos") {
        EVENTOS.style.display = "block";

    }else if (ruta == "/listeventos") {
        L_EVENTOS.style.display = "block";

    }else if (ruta == "/informe") {
        INFORME.style.display = "block";

    }else if (ruta == "/plazas") {
        PLAZAS.style.display = "block";
    }
}

function ocultarPantallas() {
    HOME.style.display = "none";
    LOGIN.style.display = "none";
    REGISTRO.style.display = "none";
    EVENTOS.style.display = "none";
    L_EVENTOS.style.display = "none";
    INFORME.style.display = "none";
    PLAZAS.style.display = "none";



}

function cerrarMenu() {
    MENU.close();
}

function MostrarToast(mensaje, duracion){
    const toast = document.createElement('ion-toast');
    toast.message = mensaje;
    toast.duration = duracion;
    document.body.appendChild(toast);
    toast.present();
}


function Alertar(titulo, subtitulo, mensaje) {
    const alert = document.createElement('ion-alert');
    alert.cssClass = 'my-custom-class'; alert.header = titulo;
    alert.subHeader = subtitulo;
    alert.message = mensaje; alert.buttons = ['OK'];
    document.body.appendChild(alert);
    alert.present();
}


function cargarDepartamentos(){
    let txt = ''

    fetch(URL_BASE + 'departamentos.php', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(function (response) {
        console.log(response);

        if (response.ok) {
            return response.json();
        } else {
            console.log(response)
        }
    }).then(function (data) {

        for(let d of data.departamentos){
            txt += `<ion-select-option value=${d.id}>${d.nombre}</ion-select-option>`

            // <ion-select-option value="apple">Apple</ion-select-option>
        }
        console.log(data.departamentos);
        document.querySelector("#slcDepartamento").innerHTML += txt
    })
}

function cargarCiudades(){
    let txt = ''
    let idDepartamento = document.querySelector("#slcDepartamento").value
    Loading("Cargando ciudades");

    fetch(URL_BASE + `ciudades.php?idDepartamento=${idDepartamento}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(function (response) {
        console.log(response);
        loading.dismiss();

        if (response.ok) {
            loading.dismiss();
            return response.json();
        } else {
            console.log(response)
            loading.dismiss();
        }
    }).then(function (data) {
        console.log(data)
        for(let c of data.ciudades){
            txt += `<ion-select-option value=${c.id}>${c.nombre}</ion-select-option>`
        }
        document.querySelector("#slcCiudad").innerHTML = txt
        loading.dismiss();
    })
}

function crearMenu(){
    let txt = ``
    document.querySelector("#menu-opciones").innerHTML = ""

    if (localStorage.getItem("apiKey") != null){
        txt+= ` <ion-item href="/" onclick=cerrarMenu()>Home</ion-item>
                <ion-item href="/eventos" onclick=pantallaEventos()>Eventos</ion-item>
                <ion-item href="/listeventos" onclick="clickListEventos()" >Lista eventos</ion-item>
                <ion-item href="/informe" onclick=menuInformeEventos()>Informe de eventos</ion-item>
                <ion-item href="/plazas" onclick=clickMapa()>Plazas</ion-item>

                <ion-item href="/" onclick=logout()>Logout</ion-item>
              `
    }else{
        txt+= `
                <ion-item href="/" onclick=cerrarMenu()>Home</ion-item>
                <ion-item href="/login" onclick=cerrarMenu()>Login</ion-item>
               <ion-item href="/registro" onclick=cerrarMenu()>Registro</ion-item>
              `
    }

    document.querySelector("#menu-opciones").innerHTML = txt
}


function logout(){
    localStorage.clear();
    cerrarMenu()
    crearMenu()
    MostrarToast("Sesión cerrada", 3500)
}

function obtenerEventos(){
    let idUsuario = localStorage.getItem("idUsuario")
    let apiKey = localStorage.getItem("apiKey")

    fetch(URL_BASE + `eventos.php?idUsuario=${idUsuario}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'apikey' : apiKey,
            'iduser' : idUsuario
        }
    }).then(function (response) {
        console.log(response);

        if (response.ok) {
            return response.json();
        } else {

        }
    }).then(function (data) {
        console.log(data);
    })
}

function agregarEventos(){
    let idUsuario = localStorage.getItem("idUsuario")
    let apiKey = localStorage.getItem("apiKey")

    let idCategoria = document.querySelector("#slcCategorias").value
    let detalle = document.querySelector("#detalleEvento").value
    let fecha = document.querySelector("#datetime").value
    fecha = fecha.replaceAll("T", " ")

    let bodyObj = new Object()
    bodyObj.idCategoria = idCategoria
    bodyObj.idUsuario = idUsuario
    bodyObj.detalle = detalle
    bodyObj.fecha = fecha


    fetch(URL_BASE + `eventos.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey' : apiKey,
            'iduser' : idUsuario,
        },
        body: JSON.stringify(bodyObj)
    }).then(function (response) {
        console.log(response);

        if (response.ok) {
            return response.json();
        } else {
            MostrarToast("¡Error!", 3500)
        }
    }).then(function (data) {

        console.log(bodyObj)
        console.log(data);
        MostrarToast("¡Evento agregado!", 3500)
        document.querySelector("#slcCategorias").value = ""
        document.querySelector("#detalleEvento").value = ""
    })
}

function obtenerCategorias(){
    Loading("Cargando");
    let txt = ""
    let idUsuario = localStorage.getItem("idUsuario")
    let apiKey = localStorage.getItem("apiKey")

    fetch(URL_BASE + `categorias.php`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'apikey' : apiKey,
            'iduser' : idUsuario
        }
    }).then(function (response) {
        console.log(response);

        if (response.ok) {
            return response.json();
        } else {
            loading.dismiss();
        }
    }).then(function (data) {
        console.log(data.categorias);
        for(let c of data.categorias){
            txt +=`<ion-select-option value=${c.id}>${c.tipo}</ion-select-option>`
        }

        document.querySelector("#slcCategorias").innerHTML = txt
        loading.dismiss();
    })
}

function pantallaEventos(){
    cerrarMenu()
    obtenerCategorias()
}


async function asyncEventos() {
    let idUsuario = localStorage.getItem("idUsuario")
    let apiKey = localStorage.getItem("apiKey")

    const response = await fetch(URL_BASE + `eventos.php?idUsuario=${idUsuario}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'apikey' : apiKey,
            'iduser' : idUsuario,
        }
    });

    const events = await response.json();
    return events;
  }


async function asyncCategorias() {
    let idUsuario = localStorage.getItem("idUsuario")
    let apiKey = localStorage.getItem("apiKey")

    const response = await fetch(URL_BASE + `categorias.php`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'apikey' : apiKey,
            'iduser' : idUsuario
        }
    });

    const cat = await response.json();
    return cat;
  }



async function listEventos(){
    Loading("Cargando");
    let fechaActual = new Date()
    let img = 'ERROR'
    let txt = ''
    let categoria = ''
    let eventsU = await asyncEventos()
    let catDisp = await asyncCategorias()
    let eventosHoy = ""
    let eventosPasados = ""


    for(let e of eventsU.eventos){
        for(let c of catDisp.categorias){
            if(e.idCategoria == c.id){
                categoria = c.tipo
                img = `https://babytracker.develotion.com/imgs/${c.imagen}.png`
            }
        }
    let fechaEvento = new Date(e.fecha)
    txt=
    `<ion-card>
        <ion-grid>
            <ion-row>
                <ion-col size="3">
                    <img alt="Silhouette of mountains" src="${img}"/>
                    <p>${categoria}</p>
                </ion-col>
                <ion-col>
                    ${e.detalle}
                </ion-col>
                <ion-col size="3">
                    <p>${e.fecha}</p>
                    <ion-button size="small" onClick="eliminarEvento(${e.id})">Borrar</ion-button>
                </ion-col>
            </ion-row>
        </ion-grid>
    </ion-card>`

    if(fechaActual.getDate() == fechaEvento.getDate()){
        eventosHoy+= txt
    }else{
        eventosPasados += txt
    }
}
if(eventosPasados.length == 0){
    eventosPasados = `<ion-card>
                            <ion-card-content>
                                Sin eventos
                            </ion-card-content>
                            </ion-card>`
}
if(eventosHoy.length == 0){
    eventosHoy = `<ion-card>
                            <ion-card-content>
                                Sin eventos
                            </ion-card-content>
                            </ion-card>`
}

document.querySelector("#eventosPas").innerHTML= eventosPasados
document.querySelector("#eventosHoy").innerHTML= eventosHoy
loading.dismiss();

}

async function eliminarEvento(id){
    let idUsuario = localStorage.getItem("idUsuario")
    let apiKey = localStorage.getItem("apiKey")

    const response = await fetch(URL_BASE + `eventos.php?idEvento=${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'apikey' : apiKey,
            'iduser' : idUsuario,
        }
    });

    const events = await response.json();
    if(response.ok){
        MostrarToast("Evento eliminado", 3500)
        listEventos()
        bibPanHoy()
    }
}

function clickListEventos(){
    cerrarMenu()
    listEventos()
    loading.dismiss();

}

function enviarEvento(){
    if(cumpleRequisitos()){
        agregarEventos()
    }
}


function cumpleRequisitos(){
    let cal = document.querySelector("#datetime").value
    let idCategoria = document.querySelector("#slcCategorias").value
    let ok = false
   
    if(cal == undefined){
        MostrarToast("Seleccione una fecha", 3500)
    }else if(idCategoria == undefined || idCategoria == ""){
        MostrarToast("Seleccione una categoria", 3500)
    }else if(!fechas()){
        MostrarToast("La fecha no puede ser posterior a la actual", 3500)
    }else{
        ok = true
        console.log("todo correcto")
    }

    return ok
}


function fechas(){
    let cal = document.querySelector("#datetime").value
    let fechaActual = new Date()
    let fechaCalendario = new Date(cal)

    return fechaCalendario <= fechaActual
}


async function bibPanHoy(){
    Loading("Cargando");
    let cantPanales = 0
    let cantBiberones = 0
    let eventsU = await asyncEventos()
    let catDisp = await asyncCategorias()
    let categoria = ""
    let txtBib = ""
    let txtPa = ""
    let img = ""
    let ultimoBib = new Date(-8640000000000000)
    let ultimoPan = new Date(-8640000000000000)



    for(let e of eventsU.eventos){
        for(let c of catDisp.categorias){
            if(e.idCategoria == c.id){
                categoria = c.tipo
                img = `https://babytracker.develotion.com/imgs/${c.imagen}.png`
            }
        }

        if (categoria == "Biberón" && fueHoy(e.fecha)){
            if(new Date(e.fecha) > ultimoBib){
                ultimoBib =  new Date(e.fecha)
            }
            cantBiberones++
            txtBib += `<ion-card>
                        <ion-grid>
                            <ion-row>
                                <ion-col size="3">
                                    <img alt="Silhouette of mountains" src="${img}"/>
                                    <p>${categoria}</p>
                                    
                                </ion-col>
                                <ion-col>
                                    ${difTiempo(e.fecha)}
                                    ${e.detalle}
                                </ion-col>
                                <ion-col size="3">
                                    <p>${e.fecha}</p>
                                    <ion-button size="small" onClick="eliminarEvento(${e.id})">Borrar</ion-button>
                                </ion-col>
                            </ion-row>
                        </ion-grid>
                    </ion-card>`
        }else if(categoria == "Pañal" && fueHoy(e.fecha)){
            if(new Date(e.fecha) > ultimoPan){
                ultimoPan =  new Date(e.fecha)
            }
            cantPanales++
            txtPa += `<ion-card>
                        <ion-grid>
                            <ion-row>
                                <ion-col size="3">
                                    <img alt="Silhouette of mountains" src="${img}"/>
                                    <p>${categoria}</p>
                                    
                                </ion-col>
                                <ion-col>
                                    ${difTiempo(e.fecha)}
                                    ${e.detalle}
                                </ion-col>
                                <ion-col size="3">
                                    <p>${e.fecha}</p>
                                    <ion-button size="small" onClick="eliminarEvento(${e.id})">Borrar</ion-button>
                                </ion-col>
                            </ion-row>
                        </ion-grid>
                    </ion-card>`
        }

    }
    if(txtBib.length == 0){
        txtBib = `<ion-card>
                                <ion-card-content>
                                    Sin eventos el dia de hoy
                                </ion-card-content>
                                </ion-card>`
        document.querySelector("#ultimoBib").innerHTML = 0

    }else{
        document.querySelector("#ultimoBib").innerHTML = difTiempo(ultimoBib)
    }
    if(txtPa.length == 0){
        txtPa = `<ion-card>
                                <ion-card-content>
                                    Sin eventos el dia de hoy
                                </ion-card-content>
                                </ion-card>`
        document.querySelector("#ultimoPan").innerHTML = 0

    }else{
        document.querySelector("#ultimoPan").innerHTML = difTiempo(ultimoPan)
    }

    document.querySelector("#listBib").innerHTML = txtBib
    document.querySelector("#listPan").innerHTML = txtPa
    document.querySelector("#cantPanales").innerHTML = cantPanales
    document.querySelector("#cantBiberones").innerHTML = cantBiberones
    

    loading.dismiss();

}

function fueHoy(parametro){
    let fechaActual = new Date()
    let fechaEvento = new Date(parametro)

    return fechaActual.getDay() == fechaEvento.getDay()
}

function difTiempo(parametro) {
    let fechaActual = new Date();
    let fechaEvento = new Date(parametro);
    let diferenciaMs = fechaEvento - fechaActual;
    let diferenciaAbsMs = Math.abs(diferenciaMs);
    let diferenciaTotalHoras = Math.floor(diferenciaAbsMs / (1000 * 60 * 60));
    let diferenciaMinutos = Math.floor((diferenciaAbsMs % (1000 * 60 * 60)) / (1000 * 60));

    return `Hace ${diferenciaTotalHoras}h ${diferenciaMinutos}m.   <br>`
}

function menuInformeEventos(){
    bibPanHoy()
    cerrarMenu()
    loading.dismiss();

}






// MAPA

let map;
let latitud = null;
let longitud = null;


function getLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        } else {
            reject("Geolocation is not supported by this browser.");
        }
    });
}

async function mapa() {
    try {
        const position = await getLocation();
        const latitud = position.coords.latitude;
        const longitud = position.coords.longitude;
        CrearMapa(latitud, longitud);
    } catch (error) {
        console.error('Error al obtener la ubicación:', error);
    }
}

async function CrearMapa(latitud, longitud) {

    if(map){
        map.remove()
    }

    map = L.map('map').setView([latitud, longitud], 14);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    
    var marker = L.marker([latitud, longitud]).addTo(map);
    marker.bindPopup("<b>Tu</b>").openPopup();

    L.circle([latitud, longitud], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 30
        }).addTo(map);        

    let plazas = await obtenerPlazas()
    for (let p of plazas){
        marker = L.marker([p.latitud, p.longitud]).addTo(map);
        
        let mascotas = p.aceptaMascotas == 1 ? "Sí" : "No";
        let accesible = p.accesible == 1 ? "Sí" : "No";



        marker.bindPopup(`<p>Permite mascotas: ${mascotas} <br> Accesible: ${accesible}</p>`)
    }
    
}

async function obtenerPlazas(){
    let idUsuario = localStorage.getItem("idUsuario")
    let apiKey = localStorage.getItem("apiKey")

    const response = await fetch(URL_BASE + `plazas.php`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'apikey' : apiKey,
            'iduser' : idUsuario,
        }
    });

    const events = await response.json();
    if(response.ok){
        return events.plazas
    }
}


function clickMapa(){
    mapa()
    cerrarMenu()
}