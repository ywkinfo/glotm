import {
  legalNavLinks,
  legalNoticeBullets,
  legalNoticeSummary,
  legalNoticeTitle
} from "../trustLegal";
import { FullDocumentLink } from "./appShared";

export function TrustLegalNotice({ surface }: { surface: "gateway" | "brief" | "report" | "guide" }) {
  const surfaceLabel = {
    gateway: "Gateway",
    brief: "Brief",
    report: "Report",
    guide: "Guide"
  }[surface];

  return (
    <aside className="brief-item-card" aria-label={`${surfaceLabel} legal notice`}>
      <div className="brief-item-header">
        <span className="brief-item-index">!</span>
        <div>
          <p className="gateway-kicker">{legalNoticeTitle}</p>
          <h2 className="brief-item-title">{surfaceLabel} 공통 고지</h2>
          <p className="brief-item-copy">{legalNoticeSummary}</p>
          <ul className="brief-card-list">
            {legalNoticeBullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="brief-link-row" aria-label={`${surfaceLabel} legal links`}>
            {legalNavLinks.map((link) => (
              <FullDocumentLink key={link.path} className="brief-guide-link" to={link.path}>
                {link.label}
              </FullDocumentLink>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
