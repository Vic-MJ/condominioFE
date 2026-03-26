import { io } from "socket.io-client";

const SOCKET_URL = "http://127.0.0.1:3001";

class ServicioSocket {
    constructor() {
        this.socket = null;
    }

    conectar() {
        if (this.socket) return this.socket;

        this.socket = io(SOCKET_URL, {
            transports: ["websocket"],
            autoConnect: true
        });

        this.socket.on("connect", () => {
            console.log("Conectado al servidor WebSocket:", this.socket.id);
        });

        this.socket.on("disconnect", () => {
            console.log("Desconectado del servidor WebSocket");
        });

        return this.socket;
    }

    unirseSala(sala) {
        if (this.socket) {
            this.socket.emit("join", sala);
        }
    }

    enviarMensaje(sala, mensaje) {
        if (this.socket) {
            this.socket.emit("mensaje", { sala: sala, contenido: mensaje });
        }
    }

    alRecibirMensaje(callback) {
        if (this.socket) {
            this.socket.on("mensaje", callback);
        }
    }

    desuscribirMensaje() {
        if (this.socket) {
            this.socket.off("mensaje");
        }
    }

    alRecibirNotificacion(callback) {
        if (this.socket) {
            this.socket.on("notificacion", callback);
        }
    }

    desuscribirNotificacion() {
        if (this.socket) {
            this.socket.off("notificacion");
        }
    }

    desconectar() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }
}

export default new ServicioSocket();
