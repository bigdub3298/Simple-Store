const stripe = Stripe("pk_test_pT0e2npjQVNvGixTGhTjk6ZZ00CdQ3Qv44");

const orderBtn = document.querySelector("#order-btn");
orderBtn.addEventListener("click", event => {
  stripe.redirectToCheckout({
    sessionId
  });
});
