
import React, { useState } from 'react';
import { analyzeDocument } from '../services/geminiService';

const DocumentAssistant: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [docType, setDocType] = useState('Bank Statement');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFile(f);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(f);
    }
  };

  const handleAnalyze = async () => {
    if (!preview) return;
    setLoading(true);
    setResult(null);
    try {
      const base64 = preview.split(',')[1];
      const mime = preview.split(';')[0].split(':')[1];
      const res = await analyzeDocument(base64, mime, docType);
      setResult(res);
    } catch (err) {
      console.error(err);
      setResult("We couldn't read your document. Please try again with a clearer picture.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-20 max-w-7xl">
      <div className="mb-24 text-center max-w-4xl mx-auto">
        <div className="w-20 h-20 rounded-[28px] bg-amber-500 text-black flex items-center justify-center text-3xl shadow-xl mx-auto mb-10 floating">
          <i className="fa-solid fa-file-circle-check"></i>
        </div>
        <h1 className="text-5xl md:text-8xl font-black text-white mb-6 tracking-tighter uppercase leading-none">SAFE <span className="gold-gradient">VAULT.</span></h1>
        <p className="text-xl text-slate-500 bengali font-bold leading-relaxed tracking-wide">
          আপনার প্রয়োজনীয় ডকুমেন্টগুলো আপলোড করে AI এর মাধ্যমে যাচাই করে নিন। আমরা কমন ভুলগুলো ধরিয়ে দিতে সাহায্য করি।
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
        <div className="lg:col-span-2 space-y-12">
          <div className="glass-panel p-10 rounded-[48px] border border-white/5 shadow-2xl">
            <div className="mb-12">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] mb-6 block">Document Type</label>
              <div className="grid grid-cols-1 gap-3">
                {['Bank Statement', 'Passport Copy', 'Work Letter', 'Hotel Booking', 'Travel Insurance'].map(type => (
                  <button
                    key={type}
                    onClick={() => setDocType(type)}
                    className={`p-5 rounded-2xl text-left text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                      docType === type ? 'border-amber-500 bg-amber-500/10 text-white shadow-lg' : 'border-white/5 bg-white/5 text-slate-500 hover:border-white/20'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-12">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] mb-6 block">Upload Your File</label>
              <div className="group relative border-2 border-dashed border-white/10 rounded-[32px] p-12 text-center hover:border-amber-500 hover:bg-white/5 transition-all cursor-pointer overflow-hidden">
                <input 
                  type="file" 
                  accept="image/*,.pdf" 
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                {preview ? (
                  <div className="relative group/preview">
                    <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-2xl border border-white/10 shadow-2xl filter brightness-75 group-hover/preview:brightness-100 transition-all" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/preview:opacity-100 transition-opacity rounded-2xl flex items-center justify-center text-white text-[10px] font-black uppercase tracking-widest">
                      <i className="fa-solid fa-arrows-rotate mr-2"></i> Update File
                    </div>
                  </div>
                ) : (
                  <div className="py-10">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6 group-hover:bg-amber-500 group-hover:text-black transition-all border border-white/10">
                      <i className="fa-solid fa-cloud-arrow-up text-xl"></i>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 tracking-[0.3em] uppercase">Click or Drag File</p>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!file || loading}
              className={`w-full py-8 rounded-[32px] font-black text-2xl transition-all flex items-center justify-center gap-4 relative overflow-hidden group shadow-2xl ${
                !file || loading 
                  ? 'bg-white/5 text-slate-700 cursor-not-allowed' 
                  : 'gold-button shadow-amber-500/10'
              }`}
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner animate-spin"></i>
                  Checking...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-magnifying-glass-chart"></i>
                  Start Review
                </>
              )}
            </button>
          </div>
          
          <div className="bg-slate-900 p-10 rounded-[40px] border border-white/5 shadow-2xl">
            <h4 className="font-black text-[10px] uppercase tracking-[0.4em] mb-4 flex items-center gap-3 text-amber-500">
              <i className="fa-solid fa-shield-halved"></i>
              Private & Secure
            </h4>
            <p className="text-sm text-slate-500 font-bold leading-relaxed">
              Your documents are only used for this review. We do not save or share your personal files.
            </p>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="glass-panel rounded-[64px] border border-white/5 shadow-2xl min-h-[800px] flex flex-col p-12 md:p-20">
            <div className="flex items-center justify-between mb-16">
              <h3 className="text-3xl font-black text-white tracking-tighter uppercase">REVIEW REPORT</h3>
              {result && (
                <div className="px-6 py-2 bg-emerald-500/10 text-emerald-400 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border border-emerald-500/20">
                   READY FOR SUBMISSION
                </div>
              )}
            </div>
            
            <div className="flex-grow">
              {result ? (
                <div className="animate-fade-in">
                  <div className="bg-white/[0.03] p-10 rounded-[40px] border-l-4 border-amber-500 mb-12 whitespace-pre-wrap text-slate-300 font-bold leading-relaxed shadow-inner">
                    {result}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="p-8 rounded-[32px] bg-white/5 border border-white/5 group hover:bg-amber-500/10 transition-all">
                      <p className="text-[9px] font-black uppercase text-amber-500 tracking-widest mb-3">NEXT STEP</p>
                      <p className="text-sm font-bold text-white leading-snug">You are now ready to book your appointment.</p>
                    </div>
                    <div className="p-8 rounded-[32px] bg-white/5 border border-white/5 group hover:bg-blue-600/10 transition-all">
                      <p className="text-[9px] font-black uppercase text-blue-400 tracking-widest mb-3">NEED HELP?</p>
                      <p className="text-sm font-bold text-white leading-snug">Ask our chat assistant if you are still unsure.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center px-12 opacity-10">
                  <div className="w-40 h-40 rounded-[48px] bg-white/5 flex items-center justify-center text-7xl text-white mb-10 border border-white/5 rotate-12">
                    <i className="fa-solid fa-file-signature -rotate-12"></i>
                  </div>
                  <h4 className="text-3xl font-black text-white mb-6 tracking-tighter uppercase">Awaiting Document</h4>
                  <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">
                    Upload a file on the left to start the review
                  </p>
                </div>
              )}
            </div>

            {result && (
              <button 
                onClick={() => { setResult(null); setFile(null); setPreview(null); }}
                className="mt-16 text-[9px] font-black uppercase tracking-[0.4em] text-slate-700 hover:text-white transition-all text-center"
              >
                Clear This Report
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentAssistant;
