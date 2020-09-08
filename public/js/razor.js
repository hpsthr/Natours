import axios from 'axios'
import {showAlert} from './alert'



export const bookTour = async (email, name) => {
    const session = await axios(`/api/v1/booking/checkout-session`)
   const time = session.data.orderData.created_at
    
    const options = {
        key:"rzp_test_js92EloliiGydU",
        amount:session.data.orderData.amount,
        currency:session.data.orderData.currency,
        name:name,
        description:"Payment",
        prefill:{name, email},
        order_id:session.data.orderData.id,
        handler:function (response) {
            showAlert("success",`Your payment is successful with payment id ${response.razorpay_payment_id} and order id ${response.razorpay_order_id} `)
            window.setTimeout(() => {
                location.reload(true);
                }, 2000
                )
            
            
            }
        }
   const razorpay = new Razorpay(options)
   razorpay.open()

   if(session.data.status === "success"){
    showAlert("success",`Processing...`)
   }
   
}



// const regTour = async (tourId, paymentId, orderId, amount, receipt, time ) => {
//    try {const res = await axios({
//         mathod:"POST",
//         url:"/api/v1/booking/order-confirm",
//         data: {
//             tour:tourId,
//             payment_id:paymentId,
//             order_id:orderId,
//             amount,
//             receipt,
//             created_at:time
//         }
//     })

//     if(res.data.status === "success") {
//         showAlert("success","Your Order has been successfully placed")
//         window.location.reload(true)
//     }
// }
// catch (err) {
//     showAlert("error", err.response.data.message);
// }

// }