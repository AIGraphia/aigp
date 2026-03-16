# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of AIGP seriously. If you discover a security vulnerability, please follow these steps:

### 1. Do Not Open a Public Issue

Please **do not** open a public GitHub issue if the vulnerability is security-related.

### 2. Email Us Directly

Send a detailed report to: **security@aigp.dev**

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested fixes

### 3. What to Expect

- **Initial Response**: Within 48 hours
- **Status Update**: Within 1 week
- **Fix Timeline**: Depends on severity
  - **Critical**: 24-72 hours
  - **High**: 1-2 weeks
  - **Medium**: 2-4 weeks
  - **Low**: Next release cycle

### 4. Disclosure Policy

- We'll work with you to understand and resolve the issue
- We'll credit you in the security advisory (unless you prefer anonymity)
- We'll coordinate public disclosure after a fix is available
- Typical disclosure timeline: 90 days from initial report

## Security Best Practices

When using AIGP:

### Input Validation
- Always validate diagram JSON against the schema
- Sanitize user-generated content before rendering
- Use Zod validation for runtime type safety

### Dependencies
- Keep AIGP packages up to date
- Monitor security advisories
- Run `pnpm audit` regularly

### Deployment
- Don't expose internal diagram data publicly
- Use authentication for diagram editing endpoints
- Rate limit API requests
- Validate file uploads

## Known Security Considerations

### Diagram Complexity
- Very large diagrams (1000+ nodes) may cause performance issues
- Consider implementing size limits in your application
- Use streaming validation for large files

### User-Generated Content
- Diagram labels and descriptions may contain user input
- Sanitize before rendering in web applications
- Implement CSP headers when rendering diagrams

### External Links
- Diagrams may contain URLs in labels or data fields
- Validate and sanitize URLs before rendering
- Consider implementing allowlists for domains

## Security Updates

We'll announce security updates through:
- GitHub Security Advisories
- npm security advisories
- Email to security@aigp.dev subscribers
- Discord #security channel (if available)

## Bug Bounty Program

We don't currently have a formal bug bounty program, but we appreciate responsible disclosure and will credit security researchers in our release notes.

## Contact

- **Security Issues**: security@aigp.dev
- **General Questions**: contact@aigp.dev
- **GitHub**: https://github.com/AIGraphia/aigp

## Hall of Fame

We thank the following security researchers who have responsibly disclosed vulnerabilities:

(None yet - be the first!)

---

Last updated: March 9, 2026
