var SocketEvents = {
        SOCKET_CONNECT: "socke_connect",
        SOCKET_ERROR: "socke_error",
        SOCKET_CLOSE: "socke_close",
        SOCKET_DATA: "socke_data",
    
        GET_SC_EVENT: function(code) {
            return "SocketDataSC_" + code.toString();
        }
    };
    
    module.exports = SocketEvents;