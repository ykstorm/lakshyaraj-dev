// Lets `node --test` load the site's TypeScript as it is. Node strips the
// types itself (22.18 and later); this hook adds the `.ts` that the source's
// relative imports leave out, since the bundler resolves them without one.
import { registerHooks } from 'node:module';

registerHooks({
  resolve(specifier, context, next) {
    if (/^\.{1,2}\//.test(specifier) && !/\.[cm]?[jt]sx?$/.test(specifier)) {
      try {
        return { ...next(`${specifier}.ts`, context), format: 'module-typescript' };
      } catch {
        // not a .ts module: the default resolver below reports it
      }
    }
    return next(specifier, context);
  },
});
