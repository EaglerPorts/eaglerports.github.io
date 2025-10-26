const GITHUB_NAME = 'EaglerPorts';

async function fetchRepos () {
  const response = await fetch(`https://api.github.com/users/${GITHUB_NAME}/repos`);
  return await sortRepos(await response.json());
}

async function sortRepos (repos) {
  const type = prefix => ({
    '': 6,
    b: 5,
    a: 4,
    'inf-': 3,
    'in-': 2,
    c: 1,
    'rd-': 0
  })[prefix?.toLowerCase() || ''] ?? -1;

  const parse = name => {
    const m = name.match(/^(inf|in|rd|c|b|a)?(\d+)\.(\d+)(?:[._-](\d+))?(?:[._-](\d+))?$/i);
    return m
      ? {
          stage: type(m[1]),
          major: +m[2],
          minor: +m[3],
          patch: m[4] ? +m[4] : 0,
          extra: m[5] ? +m[5] : 0
        }
      : { stage: -1, major: -1, minor: -1, patch: -1, extra: -1 };
  };

  return repos
    .filter(r => Array.isArray(r.topics) && r.topics.includes('mcwp'))
    .slice()
    .sort(function (a, b) {
      const A = parse(a.name);
      const B = parse(b.name);
      if (A.stage !== B.stage) return B.stage - A.stage;
      if (A.major !== B.major) return B.major - A.major;
      if (A.minor !== B.minor) return B.minor - A.minor;
      if (A.patch !== B.patch) return B.patch - A.patch;
      if (A.extra !== B.extra) return B.extra - A.extra;
      return a.name.localeCompare(b.name);
    });
}
