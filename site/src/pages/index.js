import React, { useState, useEffect } from 'react';
import { graphql } from 'gatsby';

export const query = graphql`
  {
    allStripePlan {
      nodes {
        id
        nickname
        currency
        amount
      }
    }
  }
`;

const toCurrency = (amount, currency) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(
    amount / 100,
  );
};

export default ({ data }) => {
  const [stripe, setStripe] = useState();

  useEffect(() => {
    setStripe(window.Stripe(process.env.GATSBY_STRIPE_PUBLISHABLE_KEY));
  }, []);

  const handleRedirect = planID => {
    if (!stripe) return;

    stripe
      .redirectToCheckout({
        items: [{ plan: planID, quantity: 1 }],
        successUrl: 'http://localhost:8000/?success',
        cancelUrl: 'http://localhost:8000/?cancel',
      })
      .then(result => {
        if (result.error && result.error.message) {
          console.error(result.error.message);
        }
      });
  };

  return (
    <>
      <h1>Corgi Subscriptions!!!</h1>
      {data.allStripePlan.nodes.map(plan => (
        <div key={plan.id}>
          <h2>{plan.nickname}</h2>
          <p>Cost: {toCurrency(plan.amount, plan.currency)}</p>
          <button onClick={() => handleRedirect(plan.id)}>Subscribe</button>
        </div>
      ))}
    </>
  );
};
