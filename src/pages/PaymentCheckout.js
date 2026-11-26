import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";
import { useEffect, useState } from "react";
// ------  SDK 초기화 ------
// @docs https://docs.tosspayments.com/sdk/v2/js/environment#토스페이먼츠-초기화
const clientKey = "test_ck_c19AFi2VHuRH3sRu9HQjivVxYtiNFmogI7";
const customerKey = "QQep3jSXfXmYBHt8YwL4B";
export function PaymentCheckoutPage() {
  const [widgets, setWidgets] = useState(null);
  useEffect(() => {
    async function initWidgets() {
      const tossPayments = await loadTossPayments(clientKey);
      // 회원 결제
      // @docs https://docs.tosspayments.com/sdk/v2/js/payment-widget#tosspaymentswidgets
      const widgets = tossPayments.widgets({ customerKey });
      // 비회원 결제
      // const widgets = tossPayments.widgets({ customerKey: ANONYMOUS });
      setWidgets(widgets);
    }
    initWidgets();
  }, []);
  async function handlePaymentClick() {
    if (!widgets) return;
    // ------ 주문의 결제 금액 설정 ------
    // @docs https://docs.tosspayments.com/sdk/v2/js/payment-widget#widgetssetamount
    await widgets.setAmount({
      value: 1_000,
      currency: "KRW",
    });
    // ------ 결제창 렌더링 ------
    // @docs https://docs.tosspayments.com/sdk/v2/js/payment-window#widgetsrenderpaymentwindow
    const paymentWindow = await widgets.renderPaymentWindow({
      orderName: "테스트 주문",
      variantKey: {
        paymentMethod: "DEFAULT",
        agreement: "AGREEMENT",
      },
    });
    // ------ 구매자가 결제하기를 누르면 paymentRequest 이벤트가 발생해요 ------
    // @docs https://docs.tosspayments.com/sdk/v2/js/payment-window#paymentwindowon
    paymentWindow.on("paymentRequest", async ({ paymentMethod }) => {
      console.log(paymentMethod); // 구매자가 선택한 결제수단 정보
      try {
        await widgets.requestPayment({
          orderId: "tk4uLNgX35JtRTMQFXMr3",
          orderName: "테스트 주문",
          successUrl: window.location.origin + "/success",
          failUrl: window.location.origin + "/fail",
        });
      } catch (error) {
        console.error(error);
      }
    });
  }
  return <button onClick={handlePaymentClick}>결제하기</button>;
}
