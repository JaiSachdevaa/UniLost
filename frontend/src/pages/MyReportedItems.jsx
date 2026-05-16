import { useEffect, useState } from "react";
import api from "../config/api";

const statusColors = {
  pending:  'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

const MyReportedItems = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const result = await api.getUserReports();
        if (result.success) setReports(result.reports);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) return <div className="text-center py-10">Loading your reports...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b text-lg">
        My Reported Items
      </p>
      <p className="text-xs text-gray-400 mt-1 mb-6">
        Items you have reported as found. Admins review and approve them before they appear in All Items.
      </p>

      {reports.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg">You haven't reported any items yet.</p>
          <p className="text-gray-400 text-sm mt-1">
            Found something? <a href="/report" className="text-primary underline">Report it here</a>.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm flex gap-4"
            >
              {/* Media thumbnail */}
              {report.media ? (
                <img
                  src={`http://localhost:5000${report.media}`}
                  alt={report.item_type}
                  className="w-24 h-24 object-cover rounded-lg border flex-shrink-0"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-100 rounded-lg border flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-400 text-xs">No image</span>
                </div>
              )}

              {/* Details */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <p className="font-semibold text-gray-800 text-base">{report.item_type}</p>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[report.status] || 'bg-gray-100 text-gray-600'}`}>
                    {report.status}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mt-1">{report.description}</p>

                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                  <p><span className="font-medium text-gray-700">Location:</span> {report.location}</p>
                  <p><span className="font-medium text-gray-700">Found at:</span> {report.time_found}</p>
                  <p><span className="font-medium text-gray-700">Submitted:</span> {new Date(report.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>

                {/* Status message */}
                <div className={`mt-3 text-xs px-3 py-2 rounded inline-block ${
                  report.status === 'pending'
                    ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                    : report.status === 'approved'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {report.status === 'pending'  && '⏳ Awaiting admin review — will appear in All Items once approved.'}
                  {report.status === 'approved' && '✅ Approved — your item is now visible in All Items.'}
                  {report.status === 'rejected' && '❌ Rejected by admin. Please contact support if you think this is a mistake.'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReportedItems;