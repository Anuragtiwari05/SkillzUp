export function parseSkillLevel(text: string): "beginner" | "intermediate" | "advanced" | null {
  const t = text.toLowerCase();
  if (/\badvanced\b|\bexpert\b|\bpro\b/.test(t)) return "advanced";
  if (/\bintermediate\b|\bmedium\b|\bsome experience\b/.test(t)) return "intermediate";
  if (/\bbeginner\b|\bnew\b|\bnovice\b|\bfrom scratch\b|\bnever\b|\bzero\b|\bstarting out\b/.test(t)) return "beginner";
  return null;
}

export function parseGoal(text: string): "job" | "hobby" | "exam" | null {
  const t = text.toLowerCase();
  if (/\bjob\b|\bcareer\b|\bwork\b|\bemploy|\binterview\b/.test(t)) return "job";
  if (/\bexam\b|\bcertificat|\btest\b|\bqualif/.test(t)) return "exam";
  if (/\bhobby\b|\bfun\b|\bpersonal\b|\bpassion\b|\bcasual\b|\bjust curious\b/.test(t)) return "hobby";
  return null;
}

export function parseTimeAvailability(text: string): "lt2" | "2to5" | "5plus" | null {
  const t = text.toLowerCase();

  // Qualifier phrases first — "less than 2 hours" must win over the bare "2 hours"
  // number match below, otherwise it gets misread as the 2-5 bucket.
  if (/\bless than\b|\bunder\b|\bfewer than\b|<\s*\d|\bnot much\b|\ba little\b|\bbarely\b/.test(t)) {
    return "lt2";
  }
  if (/\bmore than\b|\bover\b|>\s*\d|\blots\b|\bfull.?time\b|\ba lot of time\b/.test(t)) {
    return "5plus";
  }

  // Explicit numeric ranges (e.g. "2-5 hours")
  const rangeMatch = t.match(/(\d+)\s*-\s*(\d+)/);
  if (rangeMatch) {
    const low = Number(rangeMatch[1]);
    if (low >= 5) return "5plus";
    if (low >= 2) return "2to5";
    return "lt2";
  }

  // A bare number of hours with no qualifier (e.g. "3 hours a week")
  const singleMatch = t.match(/(\d+)\s*\+?\s*(hr|hour)/);
  if (singleMatch) {
    const n = Number(singleMatch[1]);
    if (n >= 5) return "5plus";
    if (n >= 2) return "2to5";
    return "lt2";
  }

  if (/\b5\+/.test(t)) return "5plus";
  if (/\bmoderate\b|\bsome time\b/.test(t)) return "2to5";

  return null;
}
