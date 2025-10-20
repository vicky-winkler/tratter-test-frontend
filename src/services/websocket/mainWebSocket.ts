const wsAddress = "ws://localhost:8585";
var connection;

const establishConnection = () => {
  connection = new WebSocket(wsAddress);
  connection.binaryType = "arraybuffer";

  connection.onopen = function (event) {
    console.log(event);
    console.log("Successfully connected");
  };

  connection.onerror = function (event) {
    connection.close();
    setTimeout(establishConnection, 5000);
  };
};

const getConnection = () => connection;

// Export functions
export {wsAddress, connection, establishConnection, getConnection};
