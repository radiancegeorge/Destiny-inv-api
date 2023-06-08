const couponTemplate = () => {
  return `<!DOCTYPE html>
  <html>
    <head>
      <title>Your Exclusive Coupon Code Awaits!</title>
    </head>
    <body style="margin:0;padding:0;font-family:Arial, sans-serif;">
      <div class="container" style="background-color:#000;color:#FFF;padding:20px;">
        <h1 style="color:#FFF;margin:0;padding:0;">Your Exclusive Coupon Code Awaits!</h1>
        <p style="color:#DDD;">Dear customer,</p>
        <p style="color:#DDD;">Thank you for your payment! As a token of our appreciation, we are pleased to provide you with an exclusive coupon code that can be used to activate your plan.</p>
        <div class="coupon" style="background-color:#444;color:#FFF;padding:10px;font-size:18px;font-weight:bold;text-align:center;">
          Coupon Code: <span style="color: #FFC107;">[Insert Coupon Code Here]</span>
        </div>
        <div class="instructions" style="margin-top:20px;">
          <p style="color:#DDD;margin:0;">To activate your plan using the coupon code, please follow these steps:</p>
          <ol>
            <li>Visit our website at <a href="[Website URL]" style="color: #FFF;">[Website URL]</a>.</li>
            <li>Select the desired plan and proceed to the checkout page.</li>
            <li>During the checkout process, enter the coupon code to apply the discount and activate your plan.</li>
          </ol>
        </div>
        <a href="[Website URL]" class="button" style="background-color:#444;color:#FFF;display:inline-block;padding:10px 20px;text-decoration:none;border-radius:4px;margin-top:20px;">Visit Our Website</a>
      </div>
    </body>
  </html>
`;
};
export default couponTemplate;
