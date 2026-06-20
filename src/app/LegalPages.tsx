import { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";

import {
  getLegalPageBySlug,
  legalNavLinks,
  legalPages,
  legalNoticeBullets,
  legalNoticeSummary
} from "../trustLegal";
import { buildProductPath, setRuntimeDocumentTitle } from "../products/shared";
import { FullDocumentLink } from "./appShared";

export function LegalPage() {
  const params = useParams<{ legalSlug: string }>();
  const page = getLegalPageBySlug(params.legalSlug);

  useEffect(() => {
    if (!page) {
      return;
    }

    setRuntimeDocumentTitle(page.title);
  }, [page]);

  if (!page) {
    return <Navigate to={buildProductPath("/")} replace />;
  }

  return (
    <div className="gateway-page">
      <section className="brief-issue-shell">
        <div className="brief-breadcrumb">
          <FullDocumentLink to={buildProductPath("/")}>Gateway</FullDocumentLink>
          <span>/</span>
          <span>{page.navLabel}</span>
        </div>
        <div className="brief-issue-header">
          <p className="gateway-kicker">{page.kicker}</p>
          <h1 className="gateway-title">{page.title}</h1>
          <p className="gateway-lead">{page.summary}</p>
          <p className="brief-issue-note">{legalNoticeSummary}</p>
          <div className="brief-link-row" aria-label="Legal page navigation">
            {legalPages.map((entry) => (
              <FullDocumentLink key={entry.slug} className="brief-guide-link" to={entry.path}>
                {entry.navLabel}
              </FullDocumentLink>
            ))}
          </div>
        </div>

        <div className="brief-item-stack">
          {page.sections.map((section, index) => (
            <article key={section.title} className="brief-item-card">
              <div className="brief-item-header">
                <span className="brief-item-index">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h2 className="brief-item-title">{section.title}</h2>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="brief-item-copy">{paragraph}</p>
                  ))}
                </div>
              </div>
            </article>
          ))}

          <article className="brief-item-card">
            <div className="brief-item-header">
              <span className="brief-item-index">!</span>
              <div>
                <h2 className="brief-item-title">공통 고지</h2>
                <p className="brief-item-copy">{legalNoticeSummary}</p>
                <ul className="brief-card-list">
                  {legalNoticeBullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        </div>

        <div className="gateway-actions">
          <FullDocumentLink className="gateway-button gateway-button--secondary" to={buildProductPath("/")}>
            Gateway로 돌아가기
          </FullDocumentLink>
          {legalNavLinks.map((link) => (
            <FullDocumentLink key={link.path} className="gateway-button gateway-button--secondary" to={link.path}>
              {link.label}
            </FullDocumentLink>
          ))}
        </div>
      </section>
    </div>
  );
}
