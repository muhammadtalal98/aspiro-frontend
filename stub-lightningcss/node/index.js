// Stub lightningcss implementation for environments where native binary fails.
// Exposes minimal API used by Tailwind/Next so build won't crash.
const passthrough = (opts) => ({
  code: Buffer.isBuffer(opts.code) ? opts.code : Buffer.from(opts.code || ''),
  map: null
});
module.exports = {
  transform: passthrough,
  Features: {
    Nesting: 0,
    MediaQueries: 0,
    LogicalProperties: 0,
    DirSelector: 0,
    LightDark: 0
  }
};
