import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
    children?: ReactNode;
    name?: string;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error(`[ErrorBoundary ${this.props.name}] Uncaught error:`, error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="p-4 border-2 border-red-500 bg-red-900/50 text-white m-4 rounded">
                    <h2 className="font-bold text-xl mb-2">Something went wrong in {this.props.name || 'Component'}</h2>
                    <pre className="text-xs overflow-auto bg-black p-2 rounded">
                        {this.state.error?.toString()}
                    </pre>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
