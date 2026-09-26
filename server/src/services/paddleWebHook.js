
import { Paddle, EventName } from '@paddle/paddle-node-sdk';
import User from '../models/User.js';
import {env} from '../config/env.js';

const paddle = new Paddle(env.paddleApiKey);

export const handlePaddleWebhook = async (req, res) => {
  const signature = req.headers['paddle-signature'];

  if (!signature) {
    return res.status(400).send('Missing Paddle signature');
  }

  try {
    // req.body MUST be the raw body
    const rawBody = req.body.toString();

    // Verify signature + parse event
    const eventData = await paddle.webhooks.unmarshal(
      rawBody,
      env.paddleWebhookSecret,
      signature
    );

    console.log('Paddle webhook:', eventData.eventType);

    switch (eventData.eventType) {

      // -----------------------------------------
      // PAYMENT / SUBSCRIPTION CREATED
      // -----------------------------------------
      case EventName.SubscriptionCreated: {
        const subscription = eventData.data;

        console.log(
          'Paddle subscription created:',
          subscription.id
        );

        // We stored our MongoDB user ID when
        // creating the transaction.
        const userId = subscription.customData?.userId;

        if (!userId) {
          console.error('No userId in Paddle customData');
          break;
        }

        const user = await User.findById(userId);

        if (!user) {
          console.error('User not found:', userId);
          break;
        }

        user.subscriptionId = subscription.id;
        user.subscriptionStatus = subscription.status;

        // Find the plan from the Paddle price ID
        const priceId =
          subscription.items?.[0]?.price?.id;

        if (priceId === env.paddleStarterMonthlyPriceId) {
          user.plan = 'starter';
        }

        if (priceId === env.paddleProMonthlyPriceId) {
          user.plan = 'pro';
        }

        user.paddleCustomerId = subscription.customerId;

        await user.save();

        console.log(
          `User ${userId} upgraded to ${user.plan}`
        );

        break;
      }

      // -----------------------------------------
      // SUBSCRIPTION UPDATED
      // -----------------------------------------
      case EventName.SubscriptionUpdated: {
        const subscription = eventData.data;

        const user = await User.findOne({
          subscriptionId: subscription.id,
        });

        if (!user) {
          console.error(
            'User not found for subscription:',
            subscription.id
          );
          break;
        }

        user.subscriptionStatus =
          subscription.status;

        // Update plan if the price changed
        const priceId =
          subscription.items?.[0]?.price?.id;

        if (priceId === env.paddleStarterMonthlyPriceId) {
          user.plan = 'starter';
        }

        if (priceId === env.paddleProMonthlyPriceId) {
          user.plan = 'pro';
        }

        await user.save();

        console.log(
          `Subscription updated for ${user._id}`
        );

        break;
      }

      // -----------------------------------------
      // SUBSCRIPTION CANCELED
      // -----------------------------------------
      case EventName.SubscriptionCanceled: {
        const subscription = eventData.data;

        const user = await User.findOne({
          subscriptionId: subscription.id,
        });

        if (!user) {
          console.error(
            'User not found for subscription:',
            subscription.id
          );
          break;
        }

        user.subscriptionStatus = 'canceled';

        // Keep the plan if you want access until
        // the current billing period ends.
        //
        // If you want immediate downgrade:
        //
        // user.plan = 'free';

        await user.save();

        console.log(
          `Subscription canceled for ${user._id}`
        );

        break;
      }

      // -----------------------------------------
      // TRANSACTION COMPLETED
      // -----------------------------------------
      case EventName.TransactionCompleted: {
        const transaction = eventData.data;

        console.log(
          'Transaction completed:',
          transaction.id
        );

        // This is useful for storing transaction
        // information / logging successful payment.
        //
        // Do NOT rely on the frontend redirect
        // to confirm payment.

        break;
      }

      default:
        console.log(
          'Unhandled Paddle event:',
          eventData.eventType
        );
    }

    return res.status(200).send('ok');

  } catch (error) {
    console.error(
      'Paddle webhook verification/processing failed:',
      error
    );

    return res.status(400).send('Invalid webhook');
  }
};
