"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error,
            errorInfo: null,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Error caught by boundary:", error, errorInfo);
        this.setState({
            error,
            errorInfo,
        });

        // Log to error tracking service (e.g., Sentry)
        // logErrorToService(error, errorInfo);
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    handleGoHome = () => {
        window.location.href = "/";
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen bg-gradient-to-br from-christmas-green via-christmas-red to-purple-900 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 max-w-2xl w-full border-2 border-red-500/30 shadow-2xl"
                    >
                        {/* Error Icon */}
                        <div className="flex justify-center mb-6">
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 0.5, repeat: 3 }}
                                className="p-6 bg-red-500/20 rounded-full"
                            >
                                <AlertTriangle className="w-16 h-16 text-red-400" />
                            </motion.div>
                        </div>

                        {/* Error Message */}
                        <div className="text-center mb-6">
                            <h1 className="text-3xl font-bold text-white mb-3">
                                🎄 Oops! Something Went Wrong
                            </h1>
                            <p className="text-gray-300 text-lg mb-2">
                                Don't worry, Santa's elves are on it!
                            </p>
                            <p className="text-gray-400 text-sm">
                                The error has been logged and we'll fix it soon.
                            </p>
                        </div>

                        {/* Error Details (Development Only) */}
                        {process.env.NODE_ENV === "development" && this.state.error && (
                            <div className="bg-black/30 rounded-xl p-4 mb-6 max-h-48 overflow-y-auto">
                                <p className="text-red-300 font-mono text-xs mb-2">
                                    <strong>Error:</strong> {this.state.error.message}
                                </p>
                                {this.state.errorInfo && (
                                    <pre className="text-gray-400 font-mono text-xs whitespace-pre-wrap">
                                        {this.state.errorInfo.componentStack}
                                    </pre>
                                )}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={this.handleReset}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-christmas-green to-emerald-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                            >
                                <RefreshCw className="w-5 h-5" />
                                Try Again
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={this.handleGoHome}
                                className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold border border-white/30 transition-all flex items-center justify-center gap-2"
                            >
                                <Home className="w-5 h-5" />
                                Go Home
                            </motion.button>
                        </div>

                        {/* Helpful Tips */}
                        <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                            <p className="text-blue-300 text-sm font-bold mb-2">
                                💡 Quick Fixes:
                            </p>
                            <ul className="text-blue-200 text-xs space-y-1">
                                <li>• Refresh the page</li>
                                <li>• Clear your browser cache</li>
                                <li>• Check your internet connection</li>
                                <li>• Try a different browser</li>
                            </ul>
                        </div>
                    </motion.div>
                </div>
            );
        }

        return this.props.children;
    }
}

// Wrapper for functional components
export const withErrorBoundary = <P extends object>(
    Component: React.ComponentType<P>,
    fallback?: ReactNode
) => {
    return (props: P) => (
        <ErrorBoundary fallback={fallback}>
            <Component {...props} />
        </ErrorBoundary>
    );
};
