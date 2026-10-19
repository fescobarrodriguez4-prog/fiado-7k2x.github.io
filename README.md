# Libreta de fiado

Libreta digital de clientes y deudas para tiendas. Funciona sin internet y se puede instalar en el celular.
Los datos de cada tienda se guardan solo en su propio dispositivo.

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
