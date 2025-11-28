# THREAT_MODEL.md  
### Essentialis Cloud — Security Threat Model  
**Version:** 1.0  
**Last Updated:** 2025  
**Status:** Stable  

---

## 1. Introduction

This document defines the **Threat Model for Essentialis Cloud**, a privacy-first, client-side encrypted cloud storage system.  
Its purpose is to identify, analyze, and categorize potential threats across Essentialis Cloud’s architecture, cryptography, infrastructure, and user environment.

The model follows established security methodologies:
- **STRIDE Framework**
- **OWASP ASVS**
- **NIST SP 800-53**
- **ISO-27005 Risk Assessment Principles**

This threat model evolves with the system as new features, risks, and mitigations emerge.

---

## 2. System Overview

Essentialis Cloud includes the following core components:

### **Client Application**
- Performs all encryption/decryption.
- Handles user key generation, file processing, and metadata encryption.

### **Authentication Layer**
- Password-based login using strong key-stretching (PBKDF2/Argon2).
- Derives encryption keys locally.

### **API Gateway**
- Validates requests, manages authentication tokens, and routes upload/download actions.
- Never receives plaintext.

### **Metadata Store**
- Stores encrypted file metadata, version information, access rules, and directory structure.

### **Object Storage Layer**
- Holds encrypted file blobs.
- Does not access plaintext or keys.

### **Zero-Trust Architecture**
Backend infrastructure is assumed untrusted by design. A server compromise must not expose user data.


---

## 3. Security Goals

### **Confidentiality**
- Only the user can access plaintext content.
- No plaintext or keys leave the client device.

### **Integrity**
- Encrypted file blobs and metadata must not be altered undetectably.
- Strong MACs or authenticated encryption (AES-GCM or equivalent) enforce this.

### **Availability**
- Services should remain accessible, resilient, and durable.

### **Privacy**
- Minimize metadata exposure.
- No content analysis or user tracking.

### **Zero-Knowledge Server Design**
- Essentialis cannot decrypt, view, or modify user content.

---

## 4. Assets to Protect

| Asset | Description | Impact if Compromised |
|-------|------------|------------------------|
| **Client-side Encryption Keys** | Derived locally, never sent to server | Catastrophic |
| **Plaintext Files** | Original user content | Catastrophic |
| **Encrypted File Blobs** | Stored ciphertext in object storage | Medium |
| **Encrypted Metadata** | Filenames, sizes, timestamps, structure | High |
| **Authentication Secrets** | Passwords, refresh tokens | High |
| **API Gateways** | Controls system entry | High |
| **Infrastructure Availability** | Server uptime, request handling | Medium |
| **User Account Integrity** | Account settings, recovery states | High |

---

## 5. Adversaries & Capabilities

### **A. Malicious Server or Insider**
- Full access to backend infrastructure.
- Attempts metadata analysis or ciphertext manipulation.

### **B. External Attackers**
- Network-level attackers (MITM).
- API abuse, injection attempts, token theft.

### **C. Rogue Admins or Cloud Provider**
- Access to storage buckets or logs.
- Tries to correlate metadata patterns.

### **D. Device Compromise**
- Malware/keyloggers on user device.
- Attempts to extract plaintext or keys.

### **E. Passive Surveillance Actors**
- Traffic analysis.
- Large-scale metadata inference.

---

## 6. Threat Analysis (STRIDE Framework)

### **6.1 Spoofing**
- Stolen tokens or session hijacking.
- Fake clients impersonating users.
- DNS spoofing leading to phishing.

**Mitigations:**
- Strict JWT/refresh token rotation.
- PKCE + TLS pinning (mobile/desktop).
- 2FA support.
- Enforced HTTPS across all services.

---

### **6.2 Tampering**
- Manipulating encrypted blobs.
- Altering encrypted metadata structure.
- API replay attacks.

**Mitigations:**
- Authenticated encryption (AES-GCM).
- Nonce/IV uniqueness enforcement.
- Integrity checks before user decryption.
- Server-side replay detection.

---

### **6.3 Repudiation**
- Attackers performing actions without audit trails.
- Difficulty attributing actions in zero-knowledge models.

**Mitigations:**
- Encrypted audit logs (no plaintext data).
- Minimal event logging (auth events only).
- Log integrity validation (hash-chained logs).

---

### **6.4 Information Disclosure**
- Leakage of metadata through API patterns.
- Timing attacks during upload/download.
- Misconfigured storage buckets.

**Mitigations:**
- Encrypt all metadata client-side.
- Uniform request padding (future).
- No plaintext filenames or extensions.
- Storage buckets fully private + rotated keys.

---

### **6.5 Denial of Service**
- API overload.
- Large file upload abuse.
- Rate-based attacks.

**Mitigations:**
- Global+per-user rate limits.
- CDN caching for metadata fetches.
- Queued upload jobs.
- Automatic service throttling.

---

### **6.6 Elevation of Privilege**
- API misconfigurations allowing privilege escalation.
- Insecure multi-tenant isolation.
- Broken access controls.

**Mitigations:**
- Strict authorization checks for every request.
- Isolation of user namespaces.
- No server-side decryption path.
- Automated permission tests.

---

## 7. Additional Threat Categories

### **Side-Channel Threats**
- Timing attacks.
- File size correlation.

*Mitigation:*
- Optional upload padding.  
- Standardized request sizes (roadmap).

### **Cryptographic Risks**
- Weak key derivation.
- Incorrect IV/nonce handling.

*Mitigation:*
- Strong KDF (Argon2id recommended).  
- Safe random IV generation per file.  
- Internal audits before alpha launch.

### **Supply-Chain Risks**
- Vulnerable dependencies.
- Malicious NPM packages.

*Mitigation:*
- Dependency pinning.  
- SCA tools (Snyk/GitHub Dependabot).

---

## 8. Summary of High-Risk Areas

| Area | Risk Level | Reason |
|------|------------|--------|
| Client device compromise | **Critical** | Keys exist only on the device |
| Weak KDF or encryption misuse | **Critical** | Entire confidentiality model collapses |
| Metadata inference | **High** | Structural patterns leak info even if encrypted |
| API auth flaws | **High** | Possible account takeover |
| Server misconfigurations | **Medium** | Cannot expose plaintext but can break availability |

---

## 9. Recommended Roadmap for Security Hardening

1. **Independent Cryptography Review** (mandatory before public beta)  
2. **Formal Protocol Documentation**  
3. **Bug Bounty Program** (HackerOne / Intigriti)  
4. **Threat Monitoring & SIEM Integration**  
5. **2FA + Hardware Key Support**  
6. **Encrypted File Sharing Model** (future)  
7. **Optional Stealth Mode (metadata suppression)**

---

**End of Document**
