import React from 'react';

const ProjectDescription = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            {/* Hero Section */}
            <section className="text-center mb-16">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                    Next Generation Calendar App
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                    Smarter scheduling powered by AI and seamless Google Calendar integration
                </p>
            </section>

            {/* Key Features */}
            <section className="mb-16">
                <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
                    Why Choose Our Calendar App
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg mb-4 flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-medium mb-2">Smart Scheduling</h3>
                        <p className="text-gray-600">
                            AI-powered suggestions optimize your calendar based on your priorities and habits.
                        </p>
                    </div>

                    <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition">
                        <div className="w-12 h-12 bg-green-100 rounded-lg mb-4 flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-medium mb-2">Time Analytics</h3>
                        <p className="text-gray-600">
                            Visual reports show how you spend your time and suggest improvements.
                        </p>
                    </div>

                    <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg mb-4 flex items-center justify-center">
                            <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-medium mb-2">Team Coordination</h3>
                        <p className="text-gray-600">
                            Easily find meeting times that work for everyone without endless emails.
                        </p>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="mb-16">
                <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
                    How It Works
                </h2>
                <div className="bg-white p-8 rounded-xl shadow-sm">
                    <div className="flex flex-col md:flex-row md:space-x-8">
                        <div className="flex-1 mb-6 md:mb-0">
                            <h3 className="text-lg font-medium mb-4">1. Connect Your Calendar</h3>
                            <p className="text-gray-600">
                                Securely link your existing Google Calendar account in just a few clicks.
                            </p>
                        </div>
                        <div className="flex-1 mb-6 md:mb-0">
                            <h3 className="text-lg font-medium mb-4">2. Set Your Preferences</h3>
                            <p className="text-gray-600">
                                Tell us your working hours, meeting preferences, and priorities.
                            </p>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-medium mb-4">3. Enjoy Smart Scheduling</h3>
                            <p className="text-gray-600">
                                Let our AI handle the scheduling while you focus on what matters.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="text-center">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Ready to Transform Your Calendar?
                </h2>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                    Join thousands of professionals who have optimized their schedules with our app.
                </p>
                <button className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                    Get Started - It's Free
                </button>
            </section>
        </div>
    );
};

export default ProjectDescription;