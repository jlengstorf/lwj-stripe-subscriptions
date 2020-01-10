module.exports = {
  plugins: [
    'gatsby-theme-stripe-subscriptions-base',
    {
      resolve: `gatsby-plugin-stripe`,
      options: {
        async: true,
      },
    },
  ],
};
