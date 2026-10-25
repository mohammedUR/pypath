// Register the repo's Node resolve hook (scripts/ts_ext_hook.mjs), which
// appends '.ts' to extensionless relative imports and maps '@/x' to './src/x'
// so bundler-authored modules run under plain Node. Usage:
//   node --import ./scripts/register_ts_hook.mjs scripts/check_grading_parity.mts
import { register } from 'node:module';
register(new URL('./ts_ext_hook.mjs', import.meta.url));
