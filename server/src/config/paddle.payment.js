import {Paddle, Environment} from '@paddle/paddle-node-sdk'
import { env } from './env.js'

const paddle = new Paddle(
    env.paddleApiSecret,
    {
        environment: Environment.sandbox
    }
)

export default paddle