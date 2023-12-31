let url_to_head = (url) => {
  return new Promise(function (resolve, reject) {
    var script = document.createElement("script");
    script.src = url;
    script.onload = function () {
      resolve();
    };
    script.onerror = function () {
      reject("Error loading script.");
    };
    document.head.appendChild(script);
  });
};
let handle_close = (event) => {
  event.target.closest(".ms-alert").remove();
};
let handle_click = (event) => {
  if (event.target.classList.contains("ms-close")) {
    handle_close(event);
  }
};
document.addEventListener("click", handle_click);
const paypal_sdk_url = "https://www.paypal.com/sdk/js";
const client_id =
  "AYO-tPiuAS1kk2DvBCfhc7tOAi_Pt97_gvwjAPPBtQe5pmLbf2eyuBX20R2y2YCHDYBAspGj_oeB03xZ";
const currency = "USD";
const intent = "capture";

url_to_head(
  paypal_sdk_url +
    "?client-id=" +
    client_id +
    "&currency=" +
    currency +
    "&intent=" +
    intent
)
  .then(() => {
    let paypal_buttons = paypal.Buttons({
      style: {
        shape: "pill",
        color: "gold",
        layout: "vertical",
        label: "paypal",
      },

      createOrder: async function (data, actions) {
        //https://developer.paypal.com/docs/api/orders/v2/#orders_create
        const response = await fetch(
          "https://paypal-test-85mo.onrender.com/create_order",
          {
            method: "post",
            headers: { "Content-Type": "application/json; charset=utf-8" },
            body: JSON.stringify({ intent: intent }),
          }
        );

        const responseOrder = await response.json();
        return responseOrder.order.id;
      },

      onApprove: async function (data, actions) {
        console.log(data);
        let order_id = data.orderID;
        console.log(intent);
        try {
          const response = await fetch("https://paypal-test-85mo.onrender.com/complete_order", {
            method: "post",
            headers: { "Content-Type": "application/json; charset=utf-8" },
            body: JSON.stringify({
              intent: intent,
              order_id: order_id,
            }),
          });
          const order_details = await response.json();
          console.log(order_details);

          //Close out the PayPal buttons that were rendered
          paypal_buttons.close();

          const successMessage = document.querySelector("#send-cart");

          successMessage.insertAdjacentHTML(
            "afterbegin",
            `
              <div class="success-message">
                <p><strong>Thank you for purchase</strong></p>
                <p><strong>purchase id:</strong> ${order_id}</p>
              </div>
            `
          );
        } catch (error) {
          console.log(error);
          alert("An Error Ocurred!");
        }
      },

      onCancel: function (data) {
        alert("Order cancelled!");
      },

      onError: function (err) {
        console.log(err);
      },
    });
    paypal_buttons.render("#paypal-button-container");
  })
  .catch((error) => {
    console.error(error);
  });
