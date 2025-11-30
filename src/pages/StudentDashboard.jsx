import { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { useFeedback } from '../context/FeedbackContext';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './StudentDashboard.css';

export function StudentDashboard() {
  const { user, logout } = useAuth();
  const { feedbacks, addFeedback, getAnalytics, getUserFeedbacks } = useFeedback();
  const [activeTab, setActiveTab] = useState('submit');
  const [formData, setFormData] = useState({
    course: 'Intro to Programming',
    instructor: 'Dr. Smith',
    courseRating: 5,
    instructorRating: 5,
    servicesRating: 5,
    comments: '',
  });
  const [message, setMessage] = useState('');
  const analytics = getAnalytics();
  const userFeedbacks = getUserFeedbacks(user.username);

  const courses = ['Intro to Programming', 'Data Science', 'Web Development', 'Database Design'];
  const instructors = ['Dr. Smith', 'Prof. Johnson', 'Dr. Williams', 'Ms. Brown'];

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
      author: user.username,
    });
    setFormData({
      course: 'Intro to Programming',
      instructor: 'Dr. Smith',
      courseRating: 5,
      instructorRating: 5,
      servicesRating: 5,
      comments: '',
    });
    setMessage('✅ Feedback submitted successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const chartData = Object.entries(analytics.byCourse).map(([course, count]) => ({
    course: course.slice(0, 15),
    responses: count,
  }));

  const instructorData = Object.entries(analytics.byInstructor).map(([instructor, count]) => ({
    instructor: instructor.slice(0, 12),
    responses: count,
  }));

  const ratingData = [
    { rating: '1', count: analytics.byRating[1], fill: '#ef4444' },
    { rating: '2', count: analytics.byRating[2], fill: '#f97316' },
    { rating: '3', count: analytics.byRating[3], fill: '#eab308' },
    { rating: '4', count: analytics.byRating[4], fill: '#84cc16' },
    { rating: '5', count: analytics.byRating[5], fill: '#10b981' },
  ];

  return (
    <div className="student-dashboard">
      <nav className="navbar">
        <div className="nav-left">
          <h1>StudentFeed</h1>
        </div>
        <div className="nav-right">
          <span>Welcome, {user.username}</span>
          <button onClick={logout} className="btn-logout">Logout</button>
        </div>
      </nav>

      <div className="container">
        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === 'submit' ? 'active' : ''}`}
            onClick={() => setActiveTab('submit')}
          >
            Submit Feedback
          </button>
          <button
            className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            My Responses
          </button>
          <button
            className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
        </div>

        {message && <div className="success-message">{message}</div>}

        {activeTab === 'submit' && (
          <div className="tab-content fade-in">
            <div className="card">
              <h2>📋 Provide Your Feedback</h2>
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
                    placeholder="Share your detailed feedback..."
                    value={formData.comments}
                    onChange={handleChange}
                  />
                </div>

                <button type="submit" className="btn-primary">✅ Submit Feedback</button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="tab-content fade-in">
            <div className="card">
              <h2>📝 Your Feedback History</h2>
              {userFeedbacks.length === 0 ? (
                <p className="empty">No feedback submitted yet</p>
              ) : (
                <div className="feedback-list">
                  {userFeedbacks.map((fb, idx) => (
                    <div key={fb.id} className="feedback-item">
                      <div className="feedback-header">
                        <h4>{fb.course}</h4>
                        <span className="date">{new Date(fb.timestamp).toLocaleDateString()}</span>
                      </div>
                      <div className="feedback-body">
                        <p><strong>Instructor:</strong> {fb.instructor}</p>
                        <div className="ratings">
                          <span className="rating">Course: {fb.courseRating}/5 ⭐</span>
                          <span className="rating">Instructor: {fb.instructorRating}/5 ⭐</span>
                          <span className="rating">Services: {fb.servicesRating}/5 ⭐</span>
                        </div>
                        {fb.comments && <p><strong>Comments:</strong> {fb.comments}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="tab-content fade-in">
            <div className="card">
              <h2>📊 Aggregated Results</h2>
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

              <div className="charts-grid">
                {chartData.length > 0 && (
                  <div className="chart-container">
                    <h3>By Course</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="course" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="responses" fill="#5b63b5" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {ratingData.some(d => d.count > 0) && (
                  <div className="chart-container">
                    <h3>Rating Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={ratingData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="rating" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8b5cf6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              {analytics.total > 0 && (
                <div className="insights">
                  <h3>💡 Insights & Recommendations</h3>
                  <ul>
                    {analytics.avgCourseRating < 3 && <li>⚠️ Course quality ratings are below average. Consider content review.</li>}
                    {analytics.avgInstructorRating < 3 && <li>⚠️ Instructor feedback suggests training or approach revision needed.</li>}
                    {analytics.avgServicesRating < 3 && <li>⚠️ Services and facilities need improvement.</li>}
                    {analytics.avgCourseRating >= 4 && <li>✅ Students are satisfied with course content and delivery.</li>}
                    {analytics.avgInstructorRating >= 4 && <li>✅ Instructor is performing well and engaging students effectively.</li>}
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
