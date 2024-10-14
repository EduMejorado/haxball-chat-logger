# Haxball Chat Logger

Este repositorio contiene un script para monitorear y registrar el chat de una sala de Haxball, y enviarlo a un webhook de Discord en formato embed. El script está diseñado para ejecutarse mediante Tampermonkey y captura los mensajes de chat nuevos, evitando la duplicación de mensajes.

## Requisitos

- **Tampermonkey**: Debes tener instalado Tampermonkey en tu navegador para ejecutar el script.
- **Webhook de Discord**: Configura un webhook en Discord para recibir los mensajes.

## Instrucciones

1. **Instalación de Tampermonkey**:
   - Descarga e instala la extensión [Tampermonkey](https://www.tampermonkey.net/) en tu navegador (disponible para Chrome, Firefox, Edge, etc.).
   - **Activar el modo desarrollador**:
     - **Chrome**:
       1. Abre Chrome y ve a `chrome://extensions/`.
       2. Activa la opción "Modo de desarrollador" en la parte superior derecha.
     - **Firefox**:
       1. Abre Firefox y ve a `about:debugging#/runtime/this-firefox`.
       2. Haz clic en "Cargar extensión temporal" para cargar el script directamente.
     - **Edge**:
       1. Abre Edge y ve a `edge://extensions/`.
       2. Activa la opción "Modo de desarrollador" en la parte superior derecha.

2. **Agregar el script en Tampermonkey**:
   - Abre Tampermonkey desde tu navegador.
   - Haz clic en **Crear un nuevo script**.
   - Copia el contenido del archivo [haxball-chat-logger.js](./haxball-chat-logger.js) en el editor y guarda los cambios.

3. **Configurar el webhook de Discord**:
   - Abre Discord y ve al canal donde quieras recibir los mensajes.
   - **Permisos necesarios**: Asegúrate de tener permisos de **Administración** o de **Gestionar Webhooks** en el canal, ya que son necesarios para crear un webhook.
   - Configura un webhook desde la configuración del canal.
   - En el script, reemplaza el valor del webhook por tu propio URL de webhook.

4. **Ejecutar el script**:
   - Una vez configurado, Tampermonkey ejecutará el script automáticamente cuando ingreses a la página de Haxball.
   - El script enviará los mensajes del chat al webhook de Discord cada 10 segundos, evitando el envío repetido de mensajes.

## Detalles técnicos

El script envía los mensajes del chat en formato **embed** a Discord, incluyendo la siguiente estructura:

- **Description**: Contenido del chat.
- **Color**: El color del embed está configurado en formato decimal (HEX #6E5B4C).
- **Username**: El nombre de usuario aparece como "LOGS » Mensajes".
- **Avatar**: El avatar personalizado tiene un enlace a una imagen específica.

_Cada mensaje enviado a Discord está encerrado en bloques de código para evitar que el formato de Discord modifique el contenido original._

## Problemas comúnes

- **El webhook no recibe mensajes**: Verifica que el URL del webhook esté correctamente configurado y que tengas los permisos necesarios.
- **El script no se carga en Tampermonkey**: Asegúrate de que el modo desarrollador esté activado y que el script esté guardado y activado correctamente.

## Autoría

Todo el contenido de este script y del repositorio fue generado por [ChatGPT](https://chatgpt.com/) en colaboración con el usuario. El usuario no se atribuye la creación original de este código.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT. Puedes ver más detalles en el archivo [`LICENSE`](./LICENSE).
