// ==UserScript==
// @name         Haxball Chat Logger
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Captura los mensajes de chat de Haxball, los agrupa y los envía como embed a un webhook de Discord cada 10 segundos.
// @author       Tu Nombre
// @match        https://*.haxball.com/*
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    console.log("Script iniciado");

    // URL del webhook de Discord
    const webhookUrl = 'TU_WEBHOOK_URL';

    let messageQueue = [];  // Cola de mensajes para almacenar los nuevos mensajes

    // Función para enviar los mensajes almacenados en la cola cada 10 segundos
    function sendToDiscord() {
        if (messageQueue.length > 0) {
            // Combina los mensajes en un solo string, encerrados en bloques de código
            const embedContent = "```\n" + messageQueue.join('\n') + "\n```";

            // Formato del embed
            const payload = {
                content: "",  // Sin texto adicional fuera del embed
                tts: false,
                embeds: [
                    {
                        description: embedContent,  // Aquí se coloca el contenido del chat
                        color: 7232332,  // Color en formato decimal (HEX #6E5B4C)
                        fields: [],
                        footer: {
                            text: "Registro del Chat | Haxball"
                        }
                    }
                ],
                components: [],
                actions: {},
                username: "LOGS » Mensajes",  // Nombre que aparecerá como usuario
                avatar_url: "https://i.ibb.co/r0F2YWB/Dise-o-sin-t-tulo-1-removebg-preview.png"
            };

            // Enviar el embed a Discord
            GM_xmlhttpRequest({
                method: "POST",
                url: webhookUrl,
                headers: { "Content-Type": "application/json" },
                data: JSON.stringify(payload),
                onload: function(response) {
                    console.log("Respuesta del webhook: ", response.responseText);
                },
                onerror: function(error) {
                    console.error("Error al enviar al webhook: ", error);
                }
            });

            // Vaciar la cola de mensajes después de enviarlos
            messageQueue = [];
        }
    }

    // Intervalo de 10 segundos para enviar los mensajes
    setInterval(sendToDiscord, 10000);  // 10,000 milisegundos = 10 segundos

    // Espera a que el iframe de Haxball esté disponible
    function waitForIframe() {
        let iframe = document.querySelector('iframe');
        if (iframe && iframe.contentDocument) {
            console.log("Iframe encontrado");
            return iframe;
        }
        console.log("Iframe no encontrado, intentando nuevamente...");
        return null;
    }

    // Monitorea los cambios en el contenido del chat
    function monitorChatLog(iframe) {
        const chatLog = iframe.contentDocument.querySelector('.log');
        if (!chatLog) {
            console.error("No se encontró el chat log. Intentando nuevamente...");
            setTimeout(() => monitorChatLog(iframe), 2000);  // Intentar nuevamente después de 2 segundos
            return;
        }
        console.log("Chat log encontrado, comenzando a observar cambios");

        let lastMessage = "";

        const observer = new MutationObserver(() => {
            const currentMessage = chatLog.textContent.trim();  // Obtener solo el texto limpio
            if (currentMessage !== lastMessage) {
                const newMessages = currentMessage.replace(lastMessage, '').trim();
                if (newMessages) {
                    console.log("Nuevos mensajes detectados: ", newMessages);
                    messageQueue.push(newMessages);  // Agregar nuevos mensajes a la cola
                }
                lastMessage = currentMessage;  // Actualizar el último mensaje registrado
            }
        });

        observer.observe(chatLog, { childList: true, subtree: true });
    }

    // Espera hasta que el iframe y el contenido del chat estén listos
    function init() {
        const iframe = waitForIframe();
        if (iframe) {
            monitorChatLog(iframe);
        } else {
            setTimeout(init, 2000);  // Vuelve a intentar en 2 segundos
        }
    }

    init();  // Inicia el script
})();
