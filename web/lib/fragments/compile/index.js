export function compileFragments(...fragments) {
  return fragments.reduce((result, fragment) => {
    if (result.includes(fragment)) {
      return result;
    }
    return [result, fragment].join('\n');
  }, '');
}
