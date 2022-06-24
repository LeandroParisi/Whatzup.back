import { NextFunction, Request, Response } from 'express'

type EndpointFn = (req : Request, res : Response, next? : NextFunction) => Promise<Response> | Promise<void> | void | Response

export default EndpointFn
