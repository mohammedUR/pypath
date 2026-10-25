// Node resolve hook for repo scripts:
// 1) append '.ts' for extensionless relative imports (registry.ts loaders
//    are authored for bundler resolution),
// 2) map the '@/' alias to ./src/*.
const ROOT = new URL('../', import.meta.url);

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('@/')) {
    const target = new URL('./src/' + specifier.slice(2), ROOT).href;
    return resolveWithTs(target, context, nextResolve);
  }
  if (specifier.startsWith('.') || specifier.startsWith('/')) {
    return resolveWithTs(specifier, context, nextResolve);
  }
  return nextResolve(specifier, context);
}

async function resolveWithTs(specifier, context, nextResolve) {
  try {
    return await nextResolve(specifier, context);
  } catch {
    return nextResolve(specifier + '.ts', context);
  }
}
