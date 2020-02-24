export default {
  schema: {
    options: {
      toObject: {
        minimize: false,
        getters: true,
        virtuals: true,
      },
      toJSON: {
        minimize: false,
        getters: true,
        virtuals: true,
      },
      timestamps: true,
    },
  },
};
