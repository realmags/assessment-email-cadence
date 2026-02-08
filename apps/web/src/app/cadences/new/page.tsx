'use client';

import { CadenceBuilder } from '../../../components/CadenceBuilder';

export default function NewCadencePage() {
    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto mb-8">
                <h1 className="text-3xl font-bold text-gray-900">New Cadence</h1>
            </div>
            <CadenceBuilder />
        </div>
    );
}
