import CardGeneratorDemo from "@/components/main/CardGeneratorDemo";
import { Suspense } from "react";


const DemoSkeleton = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-full max-w-2xl px-4">
            <div className="h-12 bg-gray-200 rounded-lg w-full animate-pulse mb-4" />
            <div className="w-full h-96 bg-gray-200 rounded-2xl animate-pulse" />
        </div>
    </div>
);

export default function CardDemoPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Suspense fallback={<DemoSkeleton />}>
                <CardGeneratorDemo />
            </Suspense>
        </div>
    );
}
