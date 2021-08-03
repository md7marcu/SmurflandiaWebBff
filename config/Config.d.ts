/* tslint:disable */
/* eslint-disable */
declare module "node-config-ts" {
  interface IConfig {
    settings: Settings
  }
  interface Settings {
    sessionsCollection: string
    mqttLeftTopic: string
    mqttRightTopic: string
    mqttGateTopic: string
    mqttBroker: string
    mqttPassword: string
    mqttUser: string
    issuer: string
    audience: string
    serverCert: string
    algorithm: string
    gateClaim: string
    garageClaim: string
    ignoreTokenExpiration: boolean
    ignoreTokenCreation: boolean
    gateBase: string
    gateState: string
    gateOpen: string
    gateClose: string
    gateMove: string
    garageBase: string
    garageState: string
    garageLeftOpen: string
    garageLeftClose: string
    garageLeftMove: string
    garageRightOpen: string
    garageRightClose: string
    garageRightMove: string
    garageAlive: string
    gateAlive: string
    gateProtectedAlive: string
    useMongo: boolean
    corsWhitelist: string[]
    users: User[]
  }
  interface User {
    userId: string
    password: string
    email: string
    name: string
  }
  export const config: Config
  export type Config = IConfig
}
