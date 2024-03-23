import * as socketIo from "socket.io";
import http from "http";

let io: socketIo.Server;

/**
 * This method is responsible to create the Socket instance and return it to main index.ts file.
 * 
 * @param server (Http Server)
 * @returns Socket Instance (io)
 */
export const createSocketServer = (server: http.Server): socketIo.Server => {
    io = new socketIo.Server(server);
    return io;
}

/**
 * This method is responsible to return the Socket instance, so that it can be used by other controllers or routes files.
 * 
 * @returns Socket Instance (io)
 */
export const getSocket = (): socketIo.Server => {
    return io;
}
