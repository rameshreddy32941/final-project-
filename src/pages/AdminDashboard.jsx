import { useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { useFeedback } from '../context/FeedbackContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './AdminDashboard.css';

export function AdminDashboard() {
  const { user, logout } = useAuth();
  const { feedbacks, addFeedback, getAnalytics, clearAll } = useFeedback();
  const [activeTab, setActiveTab] = useState('create');
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    course: 'Intro to Programming',
    instructor: 'Dr. Smith',
    courseRating: 5,
    instructorRating: 5,
    servicesRating: 5,
    comments: '',
  });

  const courses = ['Intro to Programming', 'Data Science', 'Web Development', 'Database Design'];
  const instructors = ['Dr. Smith', 'Prof. Johnson', 'Dr. Williams', 'Ms. Brown'];
  const analytics = getAnalytics();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Rating') ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addFeedback({
      ...formData,
      author: `Admin: ${user.username}`,
    });
    setFormData({
      course: 'Intro to Programming',
      instructor: 'Dr. Smith',
      courseRating: 5,
      instructorRating: 5,
      servicesRating: 5,
      comments: '',
    });
    setMessage('✅ Feedback entry created successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleAddSampleData = () => {
    const sampleFeedbacks = [
      { course: 'Intro to Programming', instructor: 'Dr. Smith', courseRating: 4, instructorRating: 4, servicesRating: 3, comments: 'Great course content' },
      { course: 'Data Science', instructor: 'Prof. Johnson', courseRating: 5, instructorRating: 5, servicesRating: 5, comments: 'Excellent teaching' },
      { course: 'Web Development', instructor: 'Dr. Williams', courseRating: 3, instructorRating: 4, servicesRating: 3, comments: 'Could improve labs' },
    ];

    sampleFeedbacks.forEach(fb => {
      addFeedback({
        ...fb,
        author: 'Sample Student',
      });
    });

    setMessage('✅ Sample data added successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all feedback data?')) {
      clearAll();
      setMessage('✅ All data cleared!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(feedbacks, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `feedback-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    setMessage('✅ Data exported to JSON!');
    setTimeout(() => setMessage(''), 3000);
  };

  const chartData = Object.entries(analytics.byRating).map(([rating, count]) => ({
    rating: `${rating}⭐`,
    responses: count,
  }));

  return (
    <div className="admin-dashboard">
      <nav className="navbar">
        <div className="nav-left">
          <h1>🔐 Admin Dashboard</h1>
        </div>
        <div className="nav-right">
          <span>Welcome, {user.username}</span>
          <button onClick={logout} className="btn-logout">Logout</button>
        </div>
      </nav>

      <div className="container">
        <div className="admin-actions">
          <button onClick={handleExportJSON} className="btn-action btn-success">📥 Export JSON</button>
          <button onClick={handleClearAll} className="btn-action btn-danger">🗑️ Clear All</button>
          <button onClick={handleAddSampleData} className="btn-action btn-warning">⭐ Add Sample Data</button>
        </div>

        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => setActiveTab('create')}
          >
            Create Feedback
          </button>
          <button
            className={`tab-btn ${activeTab === 'view' ? 'active' : ''}`}
            onClick={() => setActiveTab('view')}
          >
            All Submissions
          </button>
          <button
            className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
        </div>

        {message && <div className="success-message">{message}</div>}

        {activeTab === 'create' && (
          <div className="tab-content fade-in">
            <div className="card">
              <h2>📋 Create New Feedback Entry</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>📚 Course</label>
                    <select name="course" value={formData.course} onChange={handleChange}>
                      {courses.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>👨‍🏫 Instructor</label>
                    <select name="instructor" value={formData.instructor} onChange={handleChange}>
                      {instructors.map(i => <option key={i}>{i}</option>)}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>⭐ Course Quality</label>
                    <select name="courseRating" value={formData.courseRating} onChange={handleChange}>
                      <option value="5">5 - Excellent</option>
                      <option value="4">4 - Good</option>
                      <option value="3">3 - Average</option>
                      <option value="2">2 - Poor</option>
                      <option value="1">1 - Very Poor</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>👨‍🏫 Instructor Quality</label>
                    <select name="instructorRating" value={formData.instructorRating} onChange={handleChange}>
                      <option value="5">5 - Excellent</option>
                      <option value="4">4 - Good</option>
                      <option value="3">3 - Average</option>
                      <option value="2">2 - Poor</option>
                      <option value="1">1 - Very Poor</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>🏢 Services & Facilities</label>
                    <select name="servicesRating" value={formData.servicesRating} onChange={handleChange}>
                      <option value="5">5 - Excellent</option>
                      <option value="4">4 - Good</option>
                      <option value="3">3 - Average</option>
                      <option value="2">2 - Poor</option>
                      <option value="1">1 - Very Poor</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>💬 Comments</label>
                  <textarea
                    name="comments"
                    placeholder="Add comments..."
                    value={formData.comments}
                    onChange={handleChange}
                  />
                </div>

                <button type="submit" className="btn-primary">✅ Create Entry</button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'view' && (
          <div className="tab-content fade-in">
            <div className="card">
              <h2>📝 Raw Responses ({feedbacks.length})</h2>
              {feedbacks.length === 0 ? (
                <p className="empty">No feedback data yet</p>
              ) : (
                <div className="table-container">
                  <table className="feedback-table">
                    <thead>
                      <tr>
                        <th>Author</th>
                        <th>Course</th>
                        <th>Instructor</th>
                        <th>Course Rating</th>
                        <th>Instructor Rating</th>
                        <th>Services Rating</th>
                        <th>Comments</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {feedbacks.map((fb) => (
                        <tr key={fb.id}>
                          <td><strong>{fb.author}</strong></td>
                          <td>{fb.course}</td>
                          <td>{fb.instructor}</td>
                          <td><span className="rating-badge">{fb.courseRating}⭐</span></td>
                          <td><span className="rating-badge">{fb.instructorRating}⭐</span></td>
                          <td><span className="rating-badge">{fb.servicesRating}⭐</span></td>
                          <td className="comments-col">{fb.comments || '-'}</td>
                          <td className="date-col">{new Date(fb.timestamp).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="tab-content fade-in">
            <div className="card">
              <h2>📊 Admin Dashboard</h2>
              
              <div className="metrics">
                <div className="metric-card">
                  <span>Total responses</span>
                  <strong>{analytics.total}</strong>
                </div>
                <div className="metric-card">
                  <span>Avg Course Rating</span>
                  <strong>{analytics.avgCourseRating.toFixed(2)}</strong>
                </div>
                <div className="metric-card">
                  <span>Avg Instructor Rating</span>
                  <strong>{analytics.avgInstructorRating.toFixed(2)}</strong>
                </div>
                <div className="metric-card">
                  <span>Avg Services Rating</span>
                  <strong>{analytics.avgServicesRating.toFixed(2)}</strong>
                </div>
              </div>

              {chartData.some(d => d.responses > 0) && (
                <div className="chart-container">
                  <h3>Rating Distribution</h3>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="rating" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="responses" fill="#5b63b5" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {analytics.total > 0 && (
                <div className="insights">
                  <h3>💡 Key Insights</h3>
                  <ul>
                    <li>📊 <strong>Total Feedback Collected:</strong> {analytics.total} responses</li>
                    <li>⭐ <strong>Overall Course Rating:</strong> {analytics.avgCourseRating}/5</li>
                    <li>👨‍🏫 <strong>Instructor Performance:</strong> {analytics.avgInstructorRating}/5</li>
                    <li>🏢 <strong>Services Quality:</strong> {analytics.avgServicesRating}/5</li>
                    {analytics.avgCourseRating < 3 && <li>⚠️ <strong>Action Required:</strong> Course quality needs improvement</li>}
                    {analytics.avgInstructorRating < 3 && <li>⚠️ <strong>Action Required:</strong> Instructor training recommended</li>}
                    {analytics.avgServicesRating < 3 && <li>⚠️ <strong>Action Required:</strong> Facilities need enhancement</li>}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
