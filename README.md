# Proyecto SPAs JS-Vanilla

## Introducción
Bienvenido a Proyecto-SPA con JavaScript vanilla, en este repositorio aprenderas como crear tu propia pagina aplicando el **Single Page Application** sin necesidad de utilizar algún framework, ten cuenta ir practicando mientras lees el documento para una mejor experiencia de aprendizaje.

## ¿Que es una pagina SPA?
Una **Single Page Application (SPA)** es un metodo para la creación de paginas web utilizado en la actualidad para agregarle dinamismo y eficiencia en los tiempos de carga, este metodo es utilizado para varios sitios conocidos como "**Gmail**", "**Twitter**" o **LinkdIn** que basán su estructura en un SPA.

Una pagina creada en base al Single Page Application (SPA) es aquella que con solo un archivo de **index.html** es capaz de mostrarle al usuario diferentes temas o apartados al usuario sin necesidad de ir desplazandose entre diferentes urls o archivos html, si no que todo va a suceder en el index y la forma de desplazamiento será por hash (/#seccion), esto favorece mucho los tiempos de carga y agiliza la navegación por parte del usuario en nuestra pagina.

## Estructura de carpetas del proyecto
```bash
├── /app
│   ├── App.js
│   ├── /assets
│   │   ├── favicon.png
│   │   └── logo-ChessGo.png
│   ├── router.js
│   ├── /styles
│   │   └── style.css
│   └── /views
│       ├── about.html
│       ├── contact.html
│       └── home.html
├── index.html
└── REAME.md
```

## Construcción de un SPA

### Requerimientos
Para poder elaborar nuestra primer pagina basada en un Single Page Application, necesitaremos de algunas tecnologias y el conocimiento de algunos lenguajes de programacion usados en la actualidad para el diseño web, algunos requisitos principales son:

- Contar un editor de texto.
- Tener conocimientos del tridente para creación web (HTML, CSS, JavaScript).

### 1. Definir nuestro index.html
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Proyecto-SPA</title>
</head>

<body>
    <nav>
        <a href="/" data-link>Inicio</a>
        <a href="/about" data-link>Informacion</a>
        <a href="/contact" data-link>Contacto</a>
    </nav>
    <main id="root"></main>
    <script src="app/index.js" type="module"></script>
</body>
</html>
```
Una vez ya creado nuestro archivo index.html, definiremos con un id unico al contenedor que le vayamos a generar dinamicamente las vistas por medio de JavaScript, no olvides enlazar tu archivo principal JavaScript, a su vez crearemos los enlaces que usaremos para navegar por nuestra SPA, (el uso del data-link es para evitar que el navegador recargue la pagina)

### 2. Definir nuestras vistas
Usaremos una carpeta especial llamada `views` que va a contener las vistas que renderizaremos en nuestro html, solo definiremos los elementos a mostrar.

- **Definimos la estructura de nuestro Home**
    ```html
    <!-- ./app/views/home.html -->
    <h1>Inicio</h1>
    <p>Bienvenido a la página de inicio</p>
    ```
- **Definimos la estructura de nuestro About**
    ```html
    <!-- ./app/views/about.html -->
    <h1>Acerca de</h1>
    <p>Estas en la seccion "Acerca de nosotrós"</p>
    ```
- **Definimos la estructura de nuestro de Contact**
    ```html
    <!-- ./app/views/contact.html -->
    <h1>Contacto</h1>
    <p>Puedes contactarme a travez del siguiente numero 111-222-333</p>
    ```

### 3. Implementar un Router
El router es el que nos permitirá intercambiar entre las vistas que le mostraremos al usuario según donde se encuentre, este mismo se encargará de **interceptar** los clicks a los enlaces con `data-link`.

- **Creamos nuestro router y asignamos nuestras rutas**
    ```javascript
    //./app/router.js

    //creamos una variable que contendrá nuestras rutas
    const routes = {
        "/": "views/home.html",
        "About": "views/about.html",
        "Contact": "views/contact.html"
    };
    ```
- **Creamos una función que se encargará de cargar la vista**
    ```javascript
    export async function navigateTo(url){
    history.pushState(null, null, url);
    await renderView(url); //llamada  a la funcion que se encarga de renderizar esa ruta
    };
    ```
    Hacemos uso del objeto `history` que se encargará de la historia de navegación sin recargar la pagina en el proceso, es decir, nos ayuda a cambiar entre url's sin recargar la pagina y reaccionar a cuando el usuario use los botones de hacia atras o adelante que el navegador le proporciona.
- **Creamos la función que se encargará de renderizar las vistas al html**
    ```javascript
    export async function renderView(url){
        const path = routes[url] || "view/home.html"; //obtiene la ruta a renderizar, la vista por defecto siempre será la de Home
        try{
            const response = await fetch(path); //obtiene la estructura de la ruta
            const html = response.text(); //transforma la respuesta en tipo texto

            document.getElementById("root").innerHTML = html; //se incerta al html la respuesta ya convertida
        }catch (error){
            document.getElementById("root").innerHTML = `<h1>Oops! Pagina no encontrada.</h1>`;
        };
    };
    ```
    Hacemos uso de fetch para hacerle una peticion al servidor y obtener la vista a mostrar según el url, y si no lo encuentra carga la vista por defecto que es Home.

- **Creamos la función que se encargará de iniciar el router**
    ```javascript
    export function initRouter(){
        //escuchará todos los clicks en el body
        document.body.addEventListener("click", evento => {
            const link = evento.target.closest("[data-link]"); //detecta si se le hizo click a los enlaces con data-link
            if (link){
                evento.preventDefault(); //evita que la pagina se recargue cuando el usuario hace click en los enlaces
                navigateTo(link.getAttribute("href")); //ejecuta la funcion de navegacion para el enlace obtenido con el atributo "href"
            }
        });
        //Maneja los retrocesos o adelantos que haga el usuario en la pagina
        window.addEventListener("popstate", function(){
            renderView(location.pathname); //renderiza la vista a donde este retroceda o se adelante
        });
        //renderiza en el html la vista actual al cargar la pagina
        renderView(location.pathname);
    };
    ```
    Esta función se encargará de capturar el evento "click" cada vez que ocurra dentro del body del archivo html, obteniendo la url del enlace a la que se le aplique el evento, a su vez, trabajamos con los botones de adelantar o retroceso de la pagina.