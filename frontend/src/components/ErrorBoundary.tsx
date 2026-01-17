import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: undefined });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="flex items-center justify-center min-h-[400px] p-6">
                    <Card className="max-w-md w-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-red-600">
                                <AlertTriangle className="w-5 h-5" />
                                Something went wrong
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground">
                                We encountered an unexpected error. Please try refreshing the page.
                            </p>
                            {this.state.error && process.env.NODE_ENV === 'development' && (
                                <div className="p-4 bg-red-50 rounded-lg">
                                    <p className="text-sm font-mono text-red-900">
                                        {this.state.error.message}
                                    </p>
                                </div>
                            )}
                            <Button onClick={this.handleReset} className="w-full">
                                Reload Page
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
