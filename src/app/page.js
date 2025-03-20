'use client';

import { useState, useEffect } from 'react';
import { fetchJobs } from '@/lib/api';
import Head from 'next/head';

export default function Home() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [hasNext, setHasNext] = useState(false);
    const [hasPrev, setHasPrev] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        async function loadJobs() {
            try {
                const data = await fetchJobs(currentPage, pageSize);
                setJobs(data.jobs);
                setHasNext(data.pagination.has_next);
                setHasPrev(data.pagination.has_prev);
                setLoading(false);
            } catch (err) {
                setError('Failed to load jobs');
                setLoading(false);
            }
        }
        loadJobs();
    }, [currentPage]);

    const handleNext = () => {
        if (jobs.length === pageSize) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <>
            <Head>
                <title>University Jobs Board</title>
            </Head>
            <div className="min-h-screen bg-gray-50">
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-gray-900">University Jobs Board</h1>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    {loading ? (
                        <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    ) : (
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                            <ul className="divide-y divide-gray-200">
                                {jobs.map((job) => (
                                    <li key={job.id} className="hover:bg-gray-50">
                                        <a href={job.url} target="_blank" className="block px-4 py-4 sm:px-6 text-blue-600 visited:text-purple-600">
                                            <div className="flex items-center justify-between">
                                                <p className="text-lg font-medium truncate">{job.title}</p>
                                                <div className="ml-2 flex-shrink-0 flex">
                                                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                        {new Date(job.date_posted).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="mt-2 sm:flex sm:justify-between">
                                                <div className="sm:flex">
                                                    <p className="flex items-center text-sm text-gray-500">
                                                        {job.university}
                                                    </p>
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                ))}
                                {jobs.length === 0 && (
                                    <li className="px-4 py-5 sm:px-6">
                                        <div className="text-center text-gray-500">
                                            No jobs found. Check back later!
                                        </div>
                                    </li>
                                )}
                            </ul>
                            <div className="flex justify-center space-x-4 p-4">
                                <button
                                    onClick={handlePrevious}
                                    disabled={!hasPrev}
                                    className={`px-4 py-2 rounded font-medium transition-colors ${
                                        hasPrev
                                            ? "cursor-pointer bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700"
                                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    }`}
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={handleNext}
                                    disabled={!hasNext}
                                    className={`px-4 py-2 rounded font-medium transition-colors ${
                                        hasNext
                                            ? "cursor-pointer bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700"
                                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    }`}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}