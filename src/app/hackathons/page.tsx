'use client';

import { useState } from 'react';
import { useHackathons } from './useHackathons';
import { PLATFORM_OPTIONS, STATUS_OPTIONS, TYPE_OPTIONS } from './constants';
import { BsSearch, BsFilter, BsTrophy, BsCalendar3, BsGeoAlt, BsPeople } from 'react-icons/bs';
import { PlatformIcon } from '@/components/PlatformIcon';

export default function HackathonsPage() {
    const {
        hackathons,
        loading,
        error,
        search,
        setSearch,
        platformFilter,
        setPlatformFilter,
        statusFilter,
        setStatusFilter,
        typeFilter,
        setTypeFilter,
        totalCount,
        filteredCount,
    } = useHackathons();

    const [showFilters, setShowFilters] = useState(false);

    return (
        // <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        //     {/* Header */}
        //     <div className="max-w-7xl mx-auto mb-6">
        //         <div className="flex items-center justify-between mb-4">
        //             <div>
        //                 <h1 className="text-3xl font-bold text-gray-900">Hackathons</h1>
        //                 <p className="text-gray-600 mt-1">
        //                     Discover hackathons from Devpost, Unstop, and Kaggle
        //                 </p>
        //             </div>
        //             <div className="text-sm text-gray-500">
        //                 {filteredCount} of {totalCount} hackathons
        //             </div>
        //         </div>

        //         {/* Search and Filters */}
        //         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        //             <div className="flex flex-col md:flex-row gap-4">
        //                 {/* Search */}
        //                 <div className="flex-1 relative">
        //                     <BsSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        //                     <input
        //                         type="text"
        //                         placeholder="Search hackathons..."
        //                         value={search}
        //                         onChange={(e) => setSearch(e.target.value)}
        //                         className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        //                     />
        //                 </div>

        //                 {/* Filter Toggle */}
        //                 <button
        //                     onClick={() => setShowFilters(!showFilters)}
        //                     className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        //                 >
        //                     <BsFilter className="w-5 h-5" />
        //                     Filters
        //                 </button>
        //             </div>

        //             {/* Filter Options */}
        //             {showFilters && (
        //                 <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
        //                     {/* Platform Filter */}
        //                     <div>
        //                         <label className="block text-sm font-medium text-gray-700 mb-2">
        //                             Platform
        //                         </label>
        //                         <select
        //                             value={platformFilter}
        //                             onChange={(e) => setPlatformFilter(e.target.value)}
        //                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        //                         >
        //                             {PLATFORM_OPTIONS.map(opt => (
        //                                 <option key={opt.value} value={opt.value}>{opt.label}</option>
        //                             ))}
        //                         </select>
        //                     </div>

        //                     {/* Status Filter */}
        //                     <div>
        //                         <label className="block text-sm font-medium text-gray-700 mb-2">
        //                             Status
        //                         </label>
        //                         <select
        //                             value={statusFilter}
        //                             onChange={(e) => setStatusFilter(e.target.value)}
        //                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        //                         >
        //                             {STATUS_OPTIONS.map(opt => (
        //                                 <option key={opt.value} value={opt.value}>{opt.label}</option>
        //                             ))}
        //                         </select>
        //                     </div>

        //                     {/* Type Filter */}
        //                     <div>
        //                         <label className="block text-sm font-medium text-gray-700 mb-2">
        //                             Type
        //                         </label>
        //                         <select
        //                             value={typeFilter}
        //                             onChange={(e) => setTypeFilter(e.target.value)}
        //                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        //                         >
        //                             {TYPE_OPTIONS.map(opt => (
        //                                 <option key={opt.value} value={opt.value}>{opt.label}</option>
        //                             ))}
        //                         </select>
        //                     </div>
        //                 </div>
        //             )}
        //         </div>
        //     </div>

        //     {/* Content */}
        //     <div className="max-w-7xl mx-auto">
        //         {loading && (
        //             <div className="text-center py-12">
        //                 <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        //                 <p className="mt-4 text-gray-600">Loading hackathons...</p>
        //             </div>
        //         )}

        //         {error && (
        //             <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        //                 {error}
        //             </div>
        //         )}

        //         {!loading && !error && hackathons.length === 0 && (
        //             <div className="text-center py-12">
        //                 <BsTrophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        //                 <p className="text-gray-600">No hackathons found</p>
        //             </div>
        //         )}

        //         {!loading && !error && hackathons.length > 0 && (
        //             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        //                 {hackathons.map(hackathon => (
        //                     <HackathonCard key={hackathon.id} hackathon={hackathon} />
        //                 ))}
        //             </div>
        //         )}
        //     </div>
        // </div>
        <div>
            
        </div>
    );
}

function HackathonCard({ hackathon }: { hackathon: any }) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'live': return 'bg-green-100 text-green-700';
            case 'upcoming': return 'bg-blue-100 text-blue-700';
            case 'closed': return 'bg-gray-100 text-gray-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getPlatformColor = (platform: string) => {
        switch (platform) {
            case 'devpost': return 'bg-blue-600';
            case 'unstop': return 'bg-purple-600';
            case 'kaggle': return 'bg-cyan-500';
            default: return 'bg-gray-600';
        }
    };

    return (
        <a
            href={hackathon.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"
        >
            {/* Thumbnail */}
            {hackathon.thumbnail && (
                <div className="h-48 bg-gray-200">
                    <img
                        src={hackathon.thumbnail}
                        alt={hackathon.title}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            <div className="p-5">
                {/* Platform Badge */}
                <div className="flex items-center gap-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getPlatformColor(hackathon.platform)} flex items-center gap-1.5`}>
                        <PlatformIcon resource={`${hackathon.platform}.com`} className="w-3 h-3" />
                        {hackathon.platform.charAt(0).toUpperCase() + hackathon.platform.slice(1)}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(hackathon.status)}`}>
                        {hackathon.status}
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {hackathon.title}
                </h3>

                {/* Details */}
                <div className="space-y-2 text-sm text-gray-600">
                    {/* Dates */}
                    <div className="flex items-center gap-2">
                        <BsCalendar3 className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">
                            {new Date(hackathon.eventStart).toLocaleDateString()} - {new Date(hackathon.eventEnd).toLocaleDateString()}
                        </span>
                    </div>

                    {/* Type */}
                    <div className="flex items-center gap-2">
                        <BsGeoAlt className="w-4 h-4 flex-shrink-0" />
                        <span className="capitalize">{hackathon.type}</span>
                    </div>

                    {/* Prize */}
                    {hackathon.totalPrize && (
                        <div className="flex items-center gap-2">
                            <BsTrophy className="w-4 h-4 flex-shrink-0" />
                            <span className="font-semibold text-green-600">
                                ${hackathon.totalPrize.toLocaleString()}
                            </span>
                        </div>
                    )}

                    {/* Participants */}
                    {hackathon.participants && (
                        <div className="flex items-center gap-2">
                            <BsPeople className="w-4 h-4 flex-shrink-0" />
                            <span>{hackathon.participants.toLocaleString()} participants</span>
                        </div>
                    )}
                </div>

                {/* Domains */}
                {hackathon.domains && hackathon.domains.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                        {hackathon.domains.slice(0, 3).map((domain: string, idx: number) => (
                            <span
                                key={idx}
                                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                            >
                                {domain}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </a>
    );
}
