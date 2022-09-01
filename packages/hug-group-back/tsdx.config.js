module.exports = {
  rollup(config) {
    config.output.format = 'iife';
    config.output.name = 'hugGroup'
    return config;
  },
};
