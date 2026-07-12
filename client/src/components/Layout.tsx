import React, { useEffect, useState, useCallback } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from '@/contexts/ThemeContext'
import { useDocuments } from '@/contexts/DocumentsContext'
import Footer from '@/components/Footer'
import { UploadModal } from '@/components/UploadModal'
import KeyboardShortcuts from '@/components/KeyboardShortcuts'
import { parseTags } from '@/utils/fileUtils'

const DocumentsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-6a2.25 2.25 0 0 0-.659-1.591l-3.5-3.5A2.25 2.25 0 0 0 13.75 2.5H6.75A2.25 2.25 0 0 0 4.5 4.75v14.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 2.75V7a1.5 1.5 0 0 0 1.5 1.5h4.25" />
  </svg>
)
const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955a1.125 1.125 0 0 1 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-6.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75" />
  </svg>
)
const InboxIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.5h5.25l1.5 2.25h4.5l1.5-2.25H21" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 4.5h13.5L21 13.5v4.125A1.875 1.875 0 0 1 19.125 19.5H4.875A1.875 1.875 0 0 1 3 17.625V13.5L5.25 4.5z" />
  </svg>
)
const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.063.379.32.696.673.846.084.036.167.074.249.115.343.17.75.146 1.071-.064l.758-.493a1.125 1.125 0 0 1 1.43.139l.773.772c.389.389.447.998.139 1.431l-.493.758c-.21.321-.234.728-.064 1.071.041.082.079.165.115.249.15.353.467.61.846.673l.894.149c.542.09.94.56.94 1.11v1.093c0 .55-.398 1.02-.94 1.11l-.894.149c-.379.063-.696.32-.846.673a6.91 6.91 0 0 1-.115.249c-.17.343-.146.75.064 1.071l.493.758c.308.433.25 1.042-.139 1.431l-.773.772a1.125 1.125 0 0 1-1.43.139l-.758-.493c-.321-.21-.728-.234-1.071-.064a6.91 6.91 0 0 1-.249.115c-.353.15-.61.467-.673.846l-.149.894c-.09.542-.56.94-1.11.94h-1.093c-.55 0-1.02-.398-1.11-.94l-.149-.894a1.125 1.125 0 0 0-.673-.846 6.91 6.91 0 0 1-.249-.115c-.343-.17-.75-.146-1.071.064l-.758.493a1.125 1.125 0 0 1-1.43-.139l-.773-.772a1.125 1.125 0 0 1-.139-1.431l.493-.758c.21-.321.234-.728.064-1.071a6.91 6.91 0 0 1-.115-.249 1.125 1.125 0 0 0-.846-.673l-.894-.149A1.125 1.125 0 0 1 3 12.674v-1.093c0-.55.398-1.02.94-1.11l.894-.149c.379-.063.696-.32.846-.673.036-.084.074-.167.115-.249.17-.343.146-.75-.064-1.071l-.493-.758a1.125 1.125 0 0 1 .139-1.431l.773-.772a1.125 1.125 0 0 1 1.43-.139l.758.493c.321.21.728.234 1.071.064.082-.041.165-.079.249-.115.353-.15.61-.467.673-.846l.149-.894z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
  </svg>
)
const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.181.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.385a.563.563 0 0 0-.181-.557L3.042 10.385a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5z" />
  </svg>
)
const LogoMark = () => (
  <img src="/favicon.svg" width={28} height={28} alt="Documentra" className="shrink-0" />
)

// Broadcast channel for global shortcut events that pages can listen to
export const ShortcutBus = {
  listeners: new Map<string, (() => void)[]>(),
  on(event: string, fn: () => void) {
    const arr = this.listeners.get(event) ?? [];
    arr.push(fn);
    this.listeners.set(event, arr);
    return () => { const a = this.listeners.get(event) ?? []; this.listeners.set(event, a.filter(f => f !== fn)); };
  },
  emit(event: string) {
    (this.listeners.get(event) ?? []).forEach(fn => fn());
  },
};

export default function Layout() {
  const { theme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const { refresh, docs } = useDocuments()
  const inboxCount = docs.filter(d => { const t = parseTags(d.tags); return t.length === 0; }).length
  const [droppedFiles, setDroppedFiles] = useState<File[]>([])
  const [showUpload, setShowUpload] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [keySequence, setKeySequence] = useState<string[]>([])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const target = e.target as Element;
    const inInput = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target.hasAttribute('contenteditable');

    if (e.key === '?' && !e.ctrlKey && !e.metaKey && !inInput) {
      e.preventDefault();
      setShowShortcuts(prev => !prev);
      return;
    }

    if (e.key === 'Escape') {
      setKeySequence([]);
      setShowShortcuts(false);
      setShowUpload(false);
      ShortcutBus.emit('escape');
      return;
    }

    if (inInput) return;

    // vim-style navigation
    if (keySequence.length === 1 && keySequence[0] === 'g') {
      e.preventDefault();
      switch (e.key.toLowerCase()) {
        case 'd': navigate('/documents'); break;
        case 'h': navigate('/'); break;
        case 'i': navigate('/inbox'); break;
        case 's': navigate('/settings'); break;
        case 'f': navigate('/favorites'); break;
      }
      setKeySequence([]);
      return;
    }

    if (e.key === 'g' && !keySequence.length) {
      e.preventDefault();
      setKeySequence(['g']);
      setTimeout(() => setKeySequence([]), 1000);
      return;
    }

    // Single-key shortcuts
    switch (e.key) {
      case 'n':
      case 'u':
        e.preventDefault();
        setShowUpload(true);
        break;
      case '/':
        e.preventDefault();
        ShortcutBus.emit('focus-search');
        break;
      case 'f':
        e.preventDefault();
        ShortcutBus.emit('toggle-favorite');
        break;
    }
  }, [keySequence, navigate]);

  useEffect(() => {
    const hasFiles = (e: DragEvent) => Array.from(e.dataTransfer?.types || []).includes('Files')
    const onDragOver = (e: DragEvent) => { if (!hasFiles(e)) return; e.preventDefault(); }
    const onDrop = (e: DragEvent) => {
      if (!hasFiles(e)) return;
      e.preventDefault();
      if ((e.target as Element)?.closest('[data-upload-modal]')) return;
      const files = Array.from(e.dataTransfer?.files || []);
      if (files.length > 0) setDroppedFiles(files);
    }

    window.addEventListener('dragover', onDragOver)
    window.addEventListener('drop', onDrop)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('dragover', onDragOver)
      window.removeEventListener('drop', onDrop)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  const navItems: { to: string; label: string; icon: React.ReactNode; count?: number }[] = [
    { to: '/', label: 'Dashboard', icon: <DashboardIcon /> },
    { to: '/documents', label: 'Documents', icon: <DocumentsIcon /> },
    { to: '/favorites', label: 'Favorites', icon: <StarIcon /> },
    { to: '/inbox', label: 'Inbox', icon: <InboxIcon />, count: inboxCount },
    { to: '/settings', label: 'Settings', icon: <SettingsIcon /> },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-bg text-text">
      <header
        className="sticky top-0 z-40 backdrop-blur-md"
        style={{ background: `${theme.surface}dd`, borderBottom: `1px solid ${theme.border}` }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group" style={{ textDecoration: 'none' }}>
            <LogoMark />
            <span className="text-xl font-extrabold tracking-tight gradient-text select-none">Documentra</span>
          </Link>

          <nav className="flex items-center gap-0.5">
            {navItems.map(item => {
              const active = item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to)
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150"
                  style={active ? { background: `${theme.accent}22`, color: theme.accent } : { color: theme.text2 }}
                >
                  {item.icon}
                  <span className="hidden sm:inline">{item.label}</span>
                  {item.count != null && item.count > 0 && (
                    <span
                      className="hidden sm:inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold leading-none"
                      style={{ background: theme.accent, color: '#fff' }}
                    >
                      {item.count}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      <Footer onShowShortcuts={() => setShowShortcuts(true)} />

      {(droppedFiles.length > 0 || showUpload) && (
        <UploadModal
          initialFiles={droppedFiles.length > 0 ? droppedFiles : undefined}
          onClose={() => { setDroppedFiles([]); setShowUpload(false); }}
          onSuccess={() => { refresh(); setDroppedFiles([]); setShowUpload(false); }}
        />
      )}

      {keySequence.length === 1 && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-2">
          <div className="px-4 py-2 rounded-lg shadow-lg border text-sm font-mono flex items-center gap-2" style={{ backgroundColor: theme.surface, borderColor: theme.accent, color: theme.text }}>
            <span style={{ color: theme.text2 }}>Navigate:</span>
            <kbd className="px-2 py-0.5 rounded border" style={{ backgroundColor: theme.bg, borderColor: theme.border }}>g</kbd>
            <span style={{ color: theme.text2 }}>â†’</span>
            <span className="text-xs" style={{ color: theme.text2 }}>d=Docs, h=Home, f=Favorites, i=Inbox, s=Settings</span>
          </div>
        </div>
      )}

      <KeyboardShortcuts isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />
    </div>
  )
}

