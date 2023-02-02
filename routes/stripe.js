const router  = require("express").Router();
const Stripe = require('stripe');
const stripe = Stripe('sk_test_51MLxEcBfznap3NcienxgZxTYDaSe9hwrLyE6gTMkWcmzwFRWLKBeT6fOmhUsdF63t8ru86qc2HSb7n1ufEvlmwNO00jwKiDrDg');

router.post('/payment', async (req, res) => {
  stripe.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: "usd"
    },
    (stripeError, stripeRes) => {
      if (stripeError){
        res.status(500).json(stripeError)
      }else{
        res.status(200).json(stripeRes)
      }
    }
  );
});

module.exports = router;