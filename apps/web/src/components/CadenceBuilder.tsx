'use client';

import React, { useState } from 'react';
import { Step } from '@email-cadence/temporal-workflow';
import { useRouter } from 'next/navigation';

export function CadenceBuilder() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [steps, setSteps] = useState<Step[]>([]);

  const addStep = (type: 'SEND_EMAIL' | 'WAIT') => {
    const newStep: Step = {
      id: Date.now().toString(),
      type,
      ...(type === 'SEND_EMAIL' ? { subject: '', body: '' } : { seconds: 10 }),
    };
    setSteps([...steps, newStep]);
  };

  const updateStep = (index: number, updatedStep: Step) => {
    const newSteps = [...steps];
    newSteps[index] = updatedStep;
    setSteps(newSteps);
  };

  const removeStep = (index: number) => {
    const newSteps = [...steps];
    newSteps.splice(index, 1);
    setSteps(newSteps);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return alert('Please enter a name');

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cadences`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, steps, id: Date.now().toString() }),
        },
      );
      if (res.ok) {
        alert('Cadence created!');
        router.push('/');
      } else {
        alert('Failed to create cadence');
      }
    } catch (err) {
      console.error(err);
      alert('Error creating cadence');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Create New Cadence</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Welcome Series"
            required
          />
        </div>

        <div className="space-y-4 mb-6">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="border p-4 rounded-md relative bg-gray-50"
            >
              <button
                type="button"
                onClick={() => removeStep(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                Remove
              </button>
              <h4 className="font-semibold mb-2">
                Step {index + 1}: {step.type}
              </h4>

              {step.type === 'SEND_EMAIL' && (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Subject"
                    className="w-full p-2 border rounded"
                    value={step.subject || ''}
                    onChange={(e) =>
                      updateStep(index, { ...step, subject: e.target.value })
                    }
                    required
                  />
                  <textarea
                    placeholder="Body"
                    className="w-full p-2 border rounded"
                    value={step.body || ''}
                    onChange={(e) =>
                      updateStep(index, { ...step, body: e.target.value })
                    }
                    required
                  />
                </div>
              )}

              {step.type === 'WAIT' && (
                <div>
                  <label className="block text-sm">Wait Seconds</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded"
                    value={step.seconds || 0}
                    onChange={(e) =>
                      updateStep(index, {
                        ...step,
                        seconds: parseInt(e.target.value),
                      })
                    }
                    min="1"
                    required
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-4 mb-6">
          <button
            type="button"
            onClick={() => addStep('SEND_EMAIL')}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
          >
            + Add Email
          </button>
          <button
            type="button"
            onClick={() => addStep('WAIT')}
            className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
          >
            + Add Wait
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
        >
          Create Cadence
        </button>
      </form>
    </div>
  );
}
