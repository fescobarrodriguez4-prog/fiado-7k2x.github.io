# Libreta de fiado

Libreta digital de clientes y deudas para tiendas. Funciona sin internet y se puede instalar en el celular.
Los datos de cada tienda se guardan solo en su propio dispositivo.

## Subirla a GitHub Pages
1. Crea un repositorio en GitHub con un nombre poco obvio (por ejemplo `fiado-7k2x`). En el plan gratis debe ser **público**.
2. Entra al repositorio, pulsa **Add file > Upload files** y arrastra TODOS los archivos de esta carpeta (incluido `.nojekyll`). Pulsa **Commit changes**.
3. Ve a **Settings > Pages**. En "Build and deployment" elige **Deploy from a branch**, rama `main`, carpeta `/ (root)` y guarda.
4. Espera uno o dos minutos. El enlace aparece en esa misma pantalla (`https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/`).
5. Activa **Enforce HTTPS** en la misma pantalla.
6. En el celular, abre el enlace y usa "Agregar a pantalla de inicio" (en iPhone, desde Safari y el botón Compartir).

## Actualizar
Sube los archivos nuevos al repositorio y, en `sw.js`, cambia `libreta-v1` por `libreta-v2` para que los celulares descarguen la versión nueva.

## Medidas de seguridad incluidas
- Política de seguridad de contenido (CSP): solo se ejecuta el código de esta misma página; sin scripts ni recursos externos.
- Sin tipografías de Google ni rastreadores: no se envían datos a terceros.
- `noindex` y `robots.txt` para que los buscadores no la listen, y sin enviar referencia al abrir enlaces.
- Los textos se escapan antes de mostrarse, y los respaldos importados se validan y limpian.
- El Excel exportado neutraliza fórmulas maliciosas en los nombres.

## Límites que conviene conocer
- Es una página "no listada", **no privada**: quien tenga el enlace puede abrirla. GitHub Pages no tiene contraseña.
- Los datos viven en el navegador y **no están cifrados**. El archivo de respaldo tampoco: guárdalo en un lugar de confianza.
- GitHub Pages no permite configurar encabezados HTTP, por eso la CSP va en la etiqueta meta (no cubre `frame-ancestors`).
- Nunca subas contraseñas, llaves ni datos de clientes reales al repositorio.
