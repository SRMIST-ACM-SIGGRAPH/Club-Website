'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import dynamic from 'next/dynamic';

const PersistentBackgroundComponent = dynamic(
  () => import('./PersistentBackground').then((m) => m.PersistentBackground),
  { ssr: false }
);

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class BackgroundErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in 3D Background:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return null; // Fail silently so the rest of the website still works
    }
    return this.props.children;
  }
}

export function PersistentBackgroundWrapper() {
  return (
    <BackgroundErrorBoundary>
      <PersistentBackgroundComponent />
    </BackgroundErrorBoundary>
  );
}
