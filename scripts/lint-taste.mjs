import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const BASELINE_PATH = path.join(ROOT, 'scripts', 'taste-baseline.json')

const RULES = [
  {
    id: 'NO_SUPPRESSION',
    regex: /@(ts-ignore|ts-expect-error)|eslint-disable|svelte-ignore|TODO\(workaround\)/,
    remediation: 'Fix the underlying type or lint contract instead of suppressing checks.'
  },
  {
    id: 'NO_CHANGELOG_COMMENT',
    regex: /(\/\/|\/\*|<!--).*?(TICKET-|SPEC-|\b202\d-\d{2}-\d{2}\b)/,
    remediation: 'Remove ticket/date changelog comments from source code; rely on git history.'
  },
  {
    id: 'NO_EMOJI_IN_UI',
    regex: /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u,
    remediation: 'Use a lucide-svelte icon instead of emoji in UI chrome.'
  },
  {
    id: 'NO_RAW_HEX_UTILITY',
    regex: /\b(?:bg|text|border|ring)-\[#[0-9a-fA-F]{3,8}\]/,
    remediation: 'Use semantic --terra-* CSS tokens instead of arbitrary hex utilities.'
  },
  {
    id: 'NO_SLOP_ANIMATION',
    regex: /\b(?:animate-ping|animate-bounce|animate-pulse)\b/,
    remediation:
      'Use compositor transforms or spring physics instead of animate-ping/bounce/pulse.'
  },
  {
    id: 'NO_RAW_EASING',
    exempt: ['src/lib/styles/tokens.css'],
    regex: /cubic-bezier\(|ease-\[/,
    remediation: 'Reference --terra-ease-* or --terra-spring-* tokens from tokens.css.'
  },
  {
    id: 'NO_RAW_DURATION',
    exempt: ['src/lib/styles/tokens.css'],
    regex: /\bduration-(?:\d+|\[\d+m?s\])/,
    remediation: 'Reference --terra-dur-* tokens or .terra-t-* utilities from tokens.css.'
  },
  {
    id: 'NO_DARK_ONLY_CLASS',
    exempt: ['src/lib/styles/tokens.css'],
    regex: /\b(?:text-white|text-black|text-slate-\d+|bg-black\/|border-white\/)\b/,
    remediation: 'Use semantic --terra-* tokens (e.g. --terra-text-primary, --terra-on-accent).'
  },
  {
    id: 'ZERO_PII',
    regex: new RegExp(`(${['foxmail', 'qq\\.com', '/Users/', 'SecondBrain'].join('|')})`, 'i'),
    remediation: 'Remove private emails, local host paths, or private vault names.'
  }
]

function walkFiles(dir) {
  const out = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      out.push(...walkFiles(full))
    } else if (/\.(ts|svelte|css)$/.test(entry.name)) {
      out.push(full)
    }
  }
  return out
}

function isCommentLine(line) {
  const t = line.trim()
  return (
    t.startsWith('//') ||
    t.startsWith('/*') ||
    t.startsWith('*') ||
    t.startsWith('<!--') ||
    t.endsWith('-->')
  )
}

function scanFile(absPath) {
  const rel = path.relative(ROOT, absPath).replace(/\\/g, '/')
  const content = fs.readFileSync(absPath, 'utf8')
  const lines = content.split('\n')
  const findings = []

  let commentRun = 0
  let commentRunStart = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const lineNo = i + 1

    if (rel === 'src/lib/styles/tokens.css' && /overflow-x:\s*hidden/.test(line)) {
      findings.push({
        rule: 'NO_ROOT_OVERFLOW_HIDDEN',
        line: lineNo,
        remediation: 'Use overflow-x: clip so scroll-driven animations and position: sticky work.'
      })
    }

    for (const rule of RULES) {
      if (rule.exempt && rule.exempt.includes(rel)) continue
      if (rule.regex.test(line)) {
        findings.push({ rule: rule.id, line: lineNo, remediation: rule.remediation })
      }
    }

    if (isCommentLine(line)) {
      if (/(={8,}|-{8,})/.test(line)) {
        findings.push({
          rule: 'NO_COMMENT_WALL',
          line: lineNo,
          remediation: 'Remove decorative banner divider comments.'
        })
      }
      if (commentRun === 0) commentRunStart = lineNo
      commentRun++
    } else {
      if (commentRun >= 4) {
        findings.push({
          rule: 'NO_COMMENT_WALL',
          line: commentRunStart,
          remediation: `Collapse or remove ${commentRun}-line contiguous comment block; keep only concise non-obvious why.`
        })
      }
      commentRun = 0
    }
  }

  if (commentRun >= 4) {
    findings.push({
      rule: 'NO_COMMENT_WALL',
      line: commentRunStart,
      remediation: `Collapse or remove ${commentRun}-line contiguous comment block.`
    })
  }

  return { rel, findings }
}

const files = [...walkFiles(path.join(ROOT, 'src')), path.join(ROOT, 'index.html')]
const results = files.map(scanFile)

if (process.argv.includes('--write-baseline')) {
  fs.writeFileSync(BASELINE_PATH, '{}\n')
  console.log('Taste baseline cleared (strict mode across all files).')
  process.exit(0)
}

const baseline = fs.existsSync(BASELINE_PATH)
  ? JSON.parse(fs.readFileSync(BASELINE_PATH, 'utf8'))
  : {}

let failed = false
for (const r of results) {
  if (r.findings.length === 0) continue
  const allowed = baseline[r.rel] ?? 0
  if (r.findings.length > allowed) {
    failed = true
    console.error(`\n[TASTE VIOLATION] ${r.rel} (${r.findings.length} > allowed ${allowed}):`)
    for (const f of r.findings) {
      console.error(`  L${f.line} [${f.rule}] -> ${f.remediation}`)
    }
  }
}

if (failed) {
  process.exit(1)
}
console.log(`Taste lint passed (${results.length} files scanned).`)
