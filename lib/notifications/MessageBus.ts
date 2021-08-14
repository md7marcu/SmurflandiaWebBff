import * as socketio from "socket.io";
import * as http from "http";
import { connect, Client } from "mqtt";
import { config } from "node-config-ts";
import Debug from "debug";
import StateService from "../services/StateService";
import SocketIOEvent from "../constants/SocketIOEvent";
const debug = Debug("SmurflandiaWebBff:MessageBus:");

// TODO: use tls with mqtt http://www.steves-internet-guide.com/using-node-mqtt-client/

export default class MessageBus {
    private io: any;
    private mqttClient: Client;
    private topicList: Array<string> = [config.settings.mqttLeftTopic, config.settings.mqttRightTopic, config.settings.mqttGateTopic];
    private stateController = new StateService();

    constructor(server: http.Server) {
        this.io = socketio.listen(server);
        this.mqttClient = connect(`mqtt://${config.settings.mqttUser}:${config.settings.mqttPassword}@${config.settings.mqttBroker}`, {});
        debug(`mqttuser ${config.settings.mqttUser}, ${config.settings.mqttBroker}`);
        this.initBus();
    }

    // When a socketIO connection occurs send the current states
    // On each message received on the message bus for the subscribed topics send the states over socketIO
    private initBus(): void {
        this.io.on("connect", this.onConnect.bind(this));
        this.io.on("disconnect", this.onDisconnect);
        this.io.on("connection", socket => {
             socket.on("getState", this.getState);
        });
        this.mqttClient.on("connect", () => {
            debug("MQTT Client connected");
        });
        this.mqttClient.on("offline", () => {
            debug("Mqtt offline.");
            this.mqttClient.unsubscribe(this.topicList);
        });

        this.mqttClient.subscribe(this.topicList, {qos: 2});
        this.mqttClient.on("message", this.messageReceived);
    }

    private getState = async () => {
        debug("State request received");

        // TODO: Get States as the client or connected user ?
        return await this.stateController.getStates("");
    }

    private onConnect = async (socket) => {
        // TODO: Get States as the client or connected user ?
        socket.emit("states", await this.stateController.getStates(""));
    }

    private onDisconnect() {
        debug("IO User disconnected");
    }

    private messageReceived = (topic, message, packet) => {
        debug(`Message ${message} on topic ${topic}`);

        switch (topic) {
            case config.settings.mqttLeftTopic:
                this.io.sockets.emit(SocketIOEvent.GarageLeft, message);
                break;
            case config.settings.mqttRightTopic:
                this.io.sockets.emit(SocketIOEvent.GarageRight, message);
                break;
            case config.settings.mqttGateTopic:
                this.io.sockets.emit(SocketIOEvent.Gate, message);
                break;
            default:
                break;
        }
    }
}
