
//creamos una variable que contendrá nuestras rutas
const routes = {
    "/": "/app/views/home.html",
    "/about": "/app/views/about.html",
    "/contact": "/app/views/contact.html"
};

export async function navigateTo(url){
    console.log("navegando a: ", url);
    history.pushState(null, null, url);
    await renderView(url);
};

export async function renderView(url){
    const path = routes[url] || "/app/views/home.html";
    try{
        const response = await fetch(path);
        const html = await response.text();

        document.getElementById("root").innerHTML = html;
    }catch (error){
        document.getElementById("root").innerHTML = `<h1>Oops! Pagina no encontrada.</h1>`
    };
};

export function initRouter(){
    document.body.addEventListener("click", evento => {
        const link = evento.target.closest("[data-link]");
        if (link){
            evento.preventDefault();
            navigateTo(link.getAttribute("href"));
        }
    });
    window.addEventListener("popstate", function(){
        renderView(location.pathname);
    });
    renderView(location.pathname);
};

