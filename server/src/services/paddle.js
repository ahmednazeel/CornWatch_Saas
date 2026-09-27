import { Environment, Paddle } from '@paddle/paddle-node-sdk';
import {env} from '../config/env.js';
const paddle = new Paddle(env.paddleApiSecret );//{environment:Environment.sandbox}
 
export const createPaddleTransaction = async ({ priceId, user }) => {
    const transaction = await paddle.transactions.create({
        items: [
        {
            priceId, 
            quantity: 1,
        },
        ],

        customerId: user.paddleCustomerId || undefined,

        customData: {
        userId: user._id.toString(),
        },
    });

    return transaction;
};