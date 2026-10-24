import SystemConfigModel from "../../models/systemConfig.model.js";
import UserModel from "../../models/user.model.js";
import crypto from "crypto";
// import { cachedData } from "../../utils/cache/cacheFromDB.js";

class SubscriptionController {
  static setWebhook = async (req, res) => {
    try {
      const secret = process.env.LEMON_SQUEEZY_SIGNING_SECRET;

      const rawBody = req.body;

      if (!rawBody) {
        throw new Error("No body");
      }

      const signature = req.get("X-Signature");
      // console.log({ signature });
      const hmac = crypto.createHmac("sha256", secret);
      hmac.update(rawBody);
      const digest = hmac.digest("hex");

      if (
        !signature ||
        !crypto.timingSafeEqual(
          Buffer.from(digest, "hex"),
          Buffer.from(signature, "hex")
        )
      ) {
        throw new Error("Invalid signature.");
      }

      // Parse the rawBody JSON
      const data = JSON.parse(rawBody);

      // Extract relevant information from Lemon Squeezy payload
      const {
        product_id,
        status,
        renews_at,
        ends_at,
        created_at,
        product_name,
        variant_name,
        card_brand,
        user_email,
        variant_id,
      } = data.data.attributes;

      // console.log(
      //   "Subscription details: ",
      //   "renews_at:",
      //   renews_at,
      //   "ends_at:",
      //   ends_at
      // );

      const subscription_id = data.data.id;
      const event_name = data.meta.event_name;
      // const customer_portal = data.data.attributes.urls.customer_portal;
      // const update_payment_method =
      //   data.data.attributes.urls.update_payment_method;

      // Find the user in the database based on the provided email
      const user = await UserModel.findOne({ email: user_email });

      if (user) {
        await UserModel.findByIdAndUpdate(user._id, {
          $set: {
            subscriptionId: subscription_id,
            productId: product_id,
            variantId: variant_id,
            subscriptionStatus: status,
            subscriptionEndsAt: ends_at || renews_at || user.subscriptionEndsAt,
            subscriptionCreatedAt: created_at,
            productName: product_name,
            variantName: variant_name,
            cardBrand: card_brand,
            eventName: event_name,
          },
        });

        // user.updatePaymentMethod = update_payment_method;
        // user.customerPortal = customer_portal;
        // Save the updated user data

        // console.log("User data updated:", user);
      } else {
        // console.log("User not found in the database");
      }

      // Respond with a 200 status to acknowledge successful receipt
      res.status(200).send("Webhook successfully captured");
    } catch (error) {
      console.error("Webhook verification failed:", error);
      res.status(400).send("Webhook verification failed");
    }
  };
}

export const { setWebhook } = SubscriptionController;
