require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

const axios = require('axios');

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;

  createTypes(`
  type StripePlan implements Node @dontInfer {
    id: String!
    amount: Int!
    currency: String!
    nickname: String!
  }
 `);
};

exports.sourceNodes = async ({
  actions,
  createNodeId,
  createContentDigest,
  reporter,
}) => {
  const plans = await axios({
    method: 'GET',
    url: 'https://api.stripe.com/v1/plans',
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
    },
  });

  if (plans.errors) {
    reporter.panic('OH NOES', plans.errors);
  }

  plans.data.data.forEach(plan => {
    const node = {
      id: plan.id,
      amount: plan.amount,
      currency: plan.currency,
      nickname: plan.nickname,
      internal: {
        type: 'StripePlan',
        contentDigest: createContentDigest(plan),
      },
    };

    actions.createNode(node);
  });
};
