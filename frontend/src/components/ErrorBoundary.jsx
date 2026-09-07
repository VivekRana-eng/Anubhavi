import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ANUBHAVI ErrorBoundary caught an exception:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/sho/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-100 p-4 font-sans text-slate-900">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8 text-center flex flex-col items-center gap-4 animate-in fade-in duration-200">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-3xl font-bold">
              ⚠️
            </div>
            
            <div className="flex flex-col gap-1">
              <h1 className="text-xl font-extrabold text-slate-900">System Recovered Smoothly</h1>
              <p className="text-xs text-slate-500 leading-relaxed">
                An unexpected view glitch occurred. The ANUBHAVI platform safeguards remain intact.
              </p>
            </div>

            {this.state.error && (
              <div className="w-full text-left bg-slate-50 rounded-xl p-3 border border-slate-200 text-[11px] font-mono text-slate-600 overflow-x-auto max-h-24">
                {this.state.error.message || String(this.state.error)}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-2 w-full mt-2">
              <button
                onClick={() => window.location.reload()}
                className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-all"
              >
                Reload Page
              </button>
              
              <button
                onClick={this.handleReset}
                className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-[#2e5746] hover:bg-[#234335] text-white text-xs font-bold transition-all shadow-md"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
