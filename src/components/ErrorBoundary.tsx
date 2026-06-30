import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#a0a0a0', background: '#0a0a0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
          <h1 style={{ color: '#fff', fontSize: '1.5rem' }}>Something went wrong</h1>
          <p>Please refresh the page.</p>
          <button onClick={() => window.location.reload()} style={{ padding: '0.5rem 1.5rem', background: '#fff', color: '#0a0a0a', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem' }}>
            Reload
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
