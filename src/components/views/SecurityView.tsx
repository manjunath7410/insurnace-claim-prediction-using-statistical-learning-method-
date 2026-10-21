import React, { useState } from 'react';
import { ShieldCheck, Lock, UserCheck, Key, Eye, ShieldAlert, Sparkles, Globe, Server, ExternalLink } from 'lucide-react';
import { AuditLogEntry, UserSession } from '../../types';
import { USER_ROLES, encryptSensitiveData } from '../../utils/security';

interface SecurityViewProps {
  session: UserSession;
}

export const SecurityView: React.FC<SecurityViewProps> = ({ session }) => {
  const [testText, setTestText] = useState('POLICY_ID_00892_CONFIDENTIAL_PII');
  const [encryptedOutput, setEncryptedOutput] = useState('');

  const handleTestEncrypt = async () => {
    const enc = await encryptSensitiveData(testText);
    setEncryptedOutput(enc);
  };

  const auditLogs: AuditLogEntry[] = [
    { id: '1', timestamp: new Date(Date.now() - 300000).toISOString(), username: session.username, role: session.role, action: 'DATASET_SYNC', details: '58,592 rows synchronized across active instances.' },
    { id: '2', timestamp: new Date(Date.now() - 600000).toISOString(), username: session.username, role: session.role, action: 'MODEL_TRAINED', details: 'Gradient Boosting & Logistic Regression models trained with stratified splits.' },
    { id: '3', timestamp: new Date(Date.now() - 900000).toISOString(), username: session.username, role: session.role, action: 'BATCH_PREDICTION', details: 'Executed batch risk scoring for 58,592 records.' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1440px] mx-auto text-slate-100 bg-[#0B1020] min-h-screen">
      <div className="border-b border-slate-800/80 pb-5">
        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          Security, Access Governance & Regulatory Audit
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Role-based access control (RBAC), end-to-end payload encryption, and immutable audit logs.
        </p>
      </div>

      {/* Role-Based Permissions Matrix */}
      <div className="bg-[#111827]/90 rounded-2xl border border-slate-800/80 p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-cyan-400" />
          Active User Session & Permissions Matrix
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {(Object.keys(USER_ROLES) as Array<keyof typeof USER_ROLES>).map((roleKey) => {
            const role = USER_ROLES[roleKey];
            const isCurrent = session.role === roleKey;

            return (
              <div
                key={roleKey}
                className={`p-5 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'bg-violet-950/40 border-violet-500 glow-violet'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <div className="font-bold text-white flex items-center justify-between">
                  <span>{role.name}</span>
                  {isCurrent && (
                    <span className="px-2 py-0.5 bg-violet-600 text-white text-[10px] rounded-full">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">{role.description}</p>
                <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                  {role.permissions.map((p) => (
                    <span key={p} className="px-2 py-0.5 bg-slate-950 border border-slate-800 text-cyan-300 text-[10px] rounded-md font-mono">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive AES-256 Payload Encryption Tester */}
      <div className="bg-[#111827]/90 rounded-2xl border border-slate-800/80 p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-400" />
          End-to-End Payload AES-256-GCM Encryption Test
        </h3>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            className="flex-1 p-3 bg-slate-900 border border-slate-700/80 rounded-xl text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            placeholder="Enter sensitive PII to encrypt..."
          />
          <button
            onClick={handleTestEncrypt}
            className="px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl cursor-pointer shadow-md transition-all shrink-0"
          >
            Encrypt Payload
          </button>
        </div>

        {encryptedOutput && (
          <div className="p-4 bg-slate-950 text-emerald-400 font-mono text-xs rounded-xl break-all border border-slate-800">
            <div className="text-slate-500 text-[10px] mb-1 font-sans uppercase">Encrypted Cipher Text (AES-256-GCM):</div>
            {encryptedOutput}
          </div>
        )}
      </div>

      {/* Audit Log Table */}
      <div className="bg-[#111827]/90 rounded-2xl border border-slate-800/80 p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white">System Activity Audit Log</h3>

        <div className="overflow-x-auto border border-slate-800 rounded-xl">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900/90 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3 font-sans">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="px-4 py-2.5 text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</td>
                  <td className="px-4 py-2.5 font-bold text-white">{log.username}</td>
                  <td className="px-4 py-2.5 text-cyan-400">{log.role}</td>
                  <td className="px-4 py-2.5 font-bold text-violet-300">{log.action}</td>
                  <td className="px-4 py-2.5 text-slate-300 font-sans">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cloud & Vercel Deployment Diagnostics */}
      <div className="bg-[#111827]/90 rounded-2xl border border-slate-800/80 p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              Cloud Deployment & Vercel Hosting Specification
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Optimized for zero-config deployment on Vercel with automated client bundling and serverless API endpoints.
            </p>
          </div>

          <a
            href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmanjunath7410%2Finsurnace-claim-prediction-using-statistical-learning-method-"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-black hover:bg-slate-900 text-white rounded-xl text-xs font-bold border border-slate-700/80 hover:border-slate-500 shadow-md transition-all self-start sm:self-auto cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 76 65" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
            </svg>
            <span>Deploy to My Vercel</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Repository</span>
            <div className="text-xs font-mono font-bold text-violet-300 truncate">
              manjunath7410/insurnace-claim-prediction...
            </div>
            <p className="text-[11px] text-slate-400">Main branch synched to GitHub</p>
          </div>

          <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Build & Output</span>
            <div className="text-xs font-mono font-bold text-emerald-400">
              vite build &rarr; /dist
            </div>
            <p className="text-[11px] text-slate-400">vercel.json configured with SPA rewrites</p>
          </div>

          <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Serverless API</span>
            <div className="text-xs font-mono font-bold text-cyan-400">
              /api/health & /api/dataset/sync
            </div>
            <p className="text-[11px] text-slate-400">Instant serverless handlers included</p>
          </div>
        </div>
      </div>
    </div>
  );
};
