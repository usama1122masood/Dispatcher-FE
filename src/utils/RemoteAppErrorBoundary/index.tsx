import React from 'react';
import type { ReactNode, ErrorInfo } from 'react';

interface RemoteAppErrorBoundaryProps {
  children: ReactNode;
}

interface RemoteAppErrorBoundaryState {
  hasError: boolean;
}

class RemoteAppErrorBoundary extends React.Component<
  RemoteAppErrorBoundaryProps,
  RemoteAppErrorBoundaryState
> {
  constructor(props: RemoteAppErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): RemoteAppErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('RemoteApp failed to load:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="remote-error">
          ⚠️ Map service is currently unavailable.
        </div>
      );
    }

    return this.props.children;
  }
}

export default RemoteAppErrorBoundary;
