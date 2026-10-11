import pino from "pino"

// Check if environment is a development env
const isDev=process.env.NODE_ENV === "development"

// Setup the logger from pino
export const logger=pino({
    level:process.env.LOG_LEVEL || (isDev? "debug" : "info"),
    transport:isDev ? {
        target:"pino-pretty",
        options:{
            colorize:true,
            ignore:"pid, hostname",
            translateTime:"HH:MM:ss Z"
        }

    }:undefined,
    redact:[
        "req.headers.authorization",
        "req.headers.cookies",
        "password",
        "token",
        "secret"
    ]

})