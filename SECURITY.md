# Security Policy

## Scope

This policy covers security issues in the public GloTm site and repository, including the React/Vite application, generated static output, GitHub Pages deployment path, and repository automation.

Content accuracy, trademark-law interpretation, factual updates, editorial corrections, and broken links are not security vulnerabilities. Report those through normal project review channels instead.

## Supported Version

GloTm is operated from the `main` branch and the GitHub Pages deployment generated from it. Security review focuses on the current public site and current repository state.

## Reporting a Vulnerability

Do not include exploitable details, tokens, credentials, private data, or proof-of-concept payloads in a public issue.

Preferred reporting path:

1. Use GitHub's private vulnerability reporting or Security Advisories for this repository if available.
2. If private reporting is not available, contact the repository owner through the owner's GitHub profile and request a private channel.
3. If the issue is low-risk and contains no sensitive detail, open a public issue with a short summary and wait for a private follow-up before sharing reproduction details.

Please include:

- affected URL, file, workflow, or dependency
- impact summary
- safe reproduction steps, if available
- whether any secret, token, or private data may be exposed

## Response Principles

This is a solo-owner project. Response times are best-effort, but high-risk reports involving credentials, deployment integrity, cross-site scripting, unauthorized content modification, or supply-chain compromise should be triaged before routine content or product work.

If a report is confirmed, the expected handling path is:

1. acknowledge and classify the issue
2. reduce exposure or disable the affected surface if needed
3. prepare a minimal fix
4. verify the public GitHub Pages output after deployment
5. document follow-up work when appropriate

## Non-Goals

This policy does not create a bug bounty program, compensation commitment, service-level agreement, or permission to perform intrusive testing. Do not run denial-of-service tests, credential attacks, destructive scans, or tests against third-party services connected to the project.
