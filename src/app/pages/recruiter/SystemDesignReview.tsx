import { useParams, useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { candidates, systemDesignResponse } from '../../data/mockData';

function getScoreColor(score: number) {
  if (score >= 80) return 'var(--success)';
  if (score >= 65) return 'var(--warning)';
  return 'var(--error)';
}

function ScoreSection({
  title,
  score,
  comment,
}: {
  title: string;
  score: number;
  comment: string;
}) {
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          {title}
        </span>
        <span className="text-sm font-semibold" style={{ color: getScoreColor(score) }}>
          {score}/100
        </span>
      </div>
      <div className="h-2 rounded-full mb-2.5" style={{ backgroundColor: 'var(--bg-elevated)' }}>
        <div
          className="h-full rounded-full"
          style={{ width: `${score}%`, backgroundColor: 'var(--accent-hover)' }}
        />
      </div>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{comment}</p>
    </div>
  );
}

export default function SystemDesignReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const candidate = candidates.find(c => c.id === id) || candidates[0];
  const designScore = Math.round((candidate.codingScore + candidate.communicationScore) / 2);

  return (
    <div className="p-4 sm:p-6">
      <button
        onClick={() => navigate(`/recruiter/candidates/${candidate.id}`)}
        className="flex items-center gap-1.5 text-sm mb-5 transition-colors cursor-pointer"
        style={{ color: 'var(--text-secondary)' }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--accent)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; }}
      >
        <ArrowLeft size={15} />
        Back to Profile
      </button>

      <div className="mb-5">
        <h1 style={{ fontSize: '1.375rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          System Design Review
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
          {candidate.name} · Design a URL Shortener · Submitted Feb 23, 2026
        </p>
      </div>

      {/* Scenario question */}
      <div
        className="rounded-lg px-5 py-4 mb-5 border"
        style={{
          borderColor: 'var(--border)',
          borderLeft: '4px solid var(--accent)',
          backgroundColor: 'var(--bg-elevated)',
        }}
      >
        <p className="text-xs font-semibold mb-1" style={{ color: 'var(--accent)' }}>
          SCENARIO QUESTION
        </p>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
          Design a URL shortening service (similar to bit.ly) that can handle 100 million
          requests per day. Your design should cover the write path (shortening a URL),
          the read path (expanding a short URL), the data model, caching strategy, and
          how you would scale the system to meet traffic demand. Discuss trade-offs where
          applicable.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Candidate response */}
        <div className="flex-1 min-w-0">
          <div
            className="rounded-lg border overflow-hidden"
            style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
          >
            <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Candidate's Written Response
              </h3>
            </div>
            <div
              className="px-5 py-4 overflow-y-auto text-sm leading-relaxed"
              style={{ maxHeight: 460, whiteSpace: 'pre-wrap', color: 'var(--text-secondary)' }}
            >
              {systemDesignResponse}
            </div>
          </div>
        </div>

        {/* AI Feedback */}
        <div className="w-full lg:w-[22rem] flex-shrink-0 space-y-5">
          <div
            className="rounded-lg p-5 border"
            style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
          >
            <h3 className="mb-4" style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              AI Feedback
            </h3>
            <ScoreSection
              title="Scalability Understanding"
              score={Math.min(designScore + 4, 100)}
              comment="Strong grasp of horizontal scaling and caching strategies. Correctly identified read-heavy workload and addressed it with CDN and Redis layers. Could benefit from deeper discussion of database sharding strategies."
            />
            <ScoreSection
              title="Architecture Clarity"
              score={designScore}
              comment="The write and read paths were clearly separated and logically described. Component responsibilities are well-defined. The inclusion of a BFF pattern consideration shows mature thinking."
            />
            <ScoreSection
              title="Design Principles"
              score={Math.max(designScore - 3, 0)}
              comment="Demonstrates understanding of CAP theorem trade-offs implicitly. Data retention and cleanup strategy is a positive inclusion. Rate limiting mention shows awareness of real-world concerns."
            />
          </div>

          {/* Overall verdict */}
          <div
            className="rounded-lg p-5 border"
            style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Overall AI Verdict
              </h3>
              <span
                className="text-sm font-semibold px-2.5 py-1 rounded"
                style={{
                  backgroundColor: designScore >= 80 ? 'var(--success-bg)' : designScore >= 65 ? 'var(--warning-bg)' : 'var(--error-bg)',
                  color: getScoreColor(designScore),
                }}
              >
                {designScore}/100
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {candidate.name}'s system design response demonstrates a strong command of
              distributed systems fundamentals. The solution is well-structured,
              covers all key components, and shows practical awareness of production
              concerns. Recommended for{' '}
              <span style={{ color: designScore >= 80 ? 'var(--success)' : 'var(--warning)' }}>
                {designScore >= 80 ? 'advancement to final round' : 'further technical screening'}.
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
