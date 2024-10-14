// ==UserScript==
// @name         Haxball Chat Logger
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Captura mensajes de chat de Haxball y los envía a Discord.
// @author       EduMejorado
// @match        https://*.haxball.com/*
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // URL del webhook de Discord
    const WEBHOOK_URL = 'YOUR_WEBHOOK_URL';

    // Cola para almacenar mensajes antes de enviarlos
    let messageQueue = [];
    let observer = null;
    let currentRoomName = "Sala desconocida"; // Nombre por defecto de la sala

    // Función para enviar mensajes a Discord mediante un webhook
    function sendToDiscord(content) {
        const payload = {
            content: "",
            tts: false, // Sin texto a voz
            embeds: [
                {
                    description: `\`\`\`\n${content}\n\`\`\``, // Encierra los mensajes en bloques de código
                    color: 7232332, // Color del embed (HEX #6E5B4C)
                    footer: {
                        text: `Registro del Chat | ${currentRoomName}`
                    }
                }
            ],
            username: "LOGS » Haxball", // Nombre que aparece en Discord
            avatar_url: "https://files.catbox.moe/org174.png" // Imagen del avatar
        };

        // Realiza la solicitud HTTP al webhook de Discord
        GM_xmlhttpRequest({
            method: 'POST',
            url: WEBHOOK_URL,
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify(payload),
            onerror: function(response) { console.error('Error al enviar a Discord:', response); },
            onload: function(response) { console.log('Enviado a Discord:', content); }
        });
    }

    // Procesa la cola de mensajes y los envía a Discord
    function processQueue() {
        if (messageQueue.length > 0) {
            const messagesToSend = messageQueue.join('\n'); // Une los mensajes en una sola cadena
            sendToDiscord(messagesToSend);
            messageQueue = []; // Vacía la cola después de enviar
        }
    }

    // Inicia la observación del contenido de chat
    function startObserving() {
        const targetNode = document.querySelector('div[data-hook="log-contents"]');
        if (targetNode) {
            const observerOptions = { childList: true, subtree: true };
            observer = new MutationObserver((mutationsList) => {
                mutationsList.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeName === 'P') { // Verifica si el nodo es un párrafo (mensaje de chat)
                                messageQueue.push(node.textContent); // Añade el texto del mensaje a la cola
                            }
                        });
                    }
                });
            });
            observer.observe(targetNode, observerOptions); // Comienza a observar el chat
        }
    }

    // Detiene la observación del chat
    function stopObserving() {
        if (observer) {
            observer.disconnect(); // Detiene la observación de cambios en el DOM
            observer = null;
        }
    }

    // Comprueba si es necesario reconectar el observador y reanudar el seguimiento de mensajes
    function checkAndReconnect() {
        const targetNode = document.querySelector('div[data-hook="log-contents"]');
        if (!targetNode) {
            stopObserving(); // Si no hay chat visible, detiene la observación
        } else if (!observer) {
            startObserving(); // Si no hay un observador activo, lo vuelve a iniciar
        }
        attachRoomNameListener(); // Asegura que el listener para el nombre de la sala esté adjunto
    }

    // Captura el nombre de la sala cuando se hace doble clic en el nombre de la sala
    function captureRoomName(event) {
        if (event.target.getAttribute('data-hook') === 'name') { // Verifica si el elemento clicado es el nombre de la sala
            currentRoomName = event.target.textContent; // Actualiza el nombre de la sala actual
        }
    }

    // Adjunta el listener para capturar el nombre de la sala
    function attachRoomNameListener() {
        document.removeEventListener('dblclick', captureRoomName); // Evita múltiples listeners
        document.addEventListener('dblclick', captureRoomName); // Adjunta el listener de doble clic
    }

    // Configuración inicial
    setInterval(processQueue, 10000); // Procesa la cola cada 10 segundos
    setInterval(checkAndReconnect, 5000); // Verifica y reconecta la observación cada 5 segundos
    startObserving(); // Inicia la observación del chat
    attachRoomNameListener(); // Adjunta el listener para capturar el nombre de la sala
})();
