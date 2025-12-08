import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: 'User', email: '', role: 'volunteer' });
  const [activeTab, setActiveTab] = useState('overview');
  const [activities, setActivities] = useState([]);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [stats, setStats] = useState({
    // Volunteer stats
    hoursVolunteered: 0,
    causesSupported: 0,
    activeParticipations: 0,
    recentActivity: [],
    // Org stats
    donationsReceived: 0,
    activeVolunteers: 0,
    impactHoursCreated: 0,
    recentSubscribers: []
  });
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [managingActivity, setManagingActivity] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [newActivity, setNewActivity] = useState({
    title: '',
    description: '',
    date: '',
    duration: '',
    location: '',
    privateDetails: '',
    externalLink: ''
  });

  const [editingId, setEditingId] = useState(null);

  const handleManage = async (activity) => {
    console.log('Managing activity:', activity);
    setManagingActivity(activity);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/activities/${activity._id}/participants`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Participants fetched:', res.data);
      setParticipants(res.data);
    } catch (error) {
      console.error('Error fetching participants:', error);
    }
  };

  const handleUpdateStatus = async (participationId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/activities/participation/${participationId}`, 
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setParticipants(participants.map(p => p._id === participationId ? { ...p, status } : p));
      
      // Refresh stats to reflect the change
      const statsRes = await axios.get('/api/dashboard/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(statsRes.data);
      
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleSaveActivity = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      let res;
      
      if (editingId) {
        // Update existing
        res = await axios.put(`/api/activities/${editingId}`, newActivity, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setActivities(activities.map(a => a._id === editingId ? res.data : a));
        alert('Activity updated successfully!');
      } else {
        // Create new
        res = await axios.post('/api/activities', newActivity, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setActivities([...activities, res.data]);
        alert('Activity created successfully!');
      }
      
      setShowCreateModal(false);
      setNewActivity({ title: '', description: '', date: '', duration: '', location: '', privateDetails: '', externalLink: '' });
      setEditingId(null);
    } catch (error) {
      console.error('Error saving activity:', error);
      alert('Failed to save activity');
    }
  };

  const startEdit = (activity) => {
    setNewActivity({
      title: activity.title,
      description: activity.description,
      date: activity.date ? activity.date.split('T')[0] : '',
      duration: activity.duration,
      location: activity.location,
      privateDetails: activity.privateDetails || '',
      externalLink: activity.externalLink || ''
    });
    setEditingId(activity._id);
    setShowCreateModal(true);
  };


  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!storedUser || !token) {
      navigate('/login');
      return;
    }
    
    setUser(JSON.parse(storedUser));

    // Fetch data
    const fetchData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        // Fetch stats
        const statsRes = await axios.get('/api/dashboard/stats', config);
        setStats(statsRes.data);

        // Fetch activities
        const currentUser = JSON.parse(storedUser);
        if (currentUser.role === 'organization') {
           console.log('Fetching created activities...');
           const activitiesRes = await axios.get('/api/activities/created', config);
           console.log('Created activities response:', activitiesRes.data);
           setActivities(activitiesRes.data);
        } else {
           // For volunteers, fetch their joined activities with details
           const activitiesRes = await axios.get('/api/activities/my-activities', config);
           setActivities(activitiesRes.data);
        }

        // Fetch bookmarks
        const bookmarksRes = await axios.get('/api/user/bookmarks', config);
        setBookmarks(bookmarksRes.data);

        // Fetch featured projects (public API)
        const featuredRes = await axios.get('/api/gg/projects/featured');
        setFeaturedProjects(featuredRes.data.projects || []);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const renderVolunteerOverview = () => (
    <div className="row g-4">
      <div className="col-md-4">
        <div className="glass-card h-100 text-center p-4">
          <h3 className="text-accent display-4 fw-bold mb-0">{stats.hoursVolunteered}</h3>
          <p className="text-muted text-uppercase small fw-bold letter-spacing-1">Hours Volunteered</p>
        </div>
      </div>
      <div className="col-md-4">
        <div className="glass-card h-100 text-center p-4">
          <h3 className="text-accent display-4 fw-bold mb-0">{stats.causesSupported}</h3>
          <p className="text-muted text-uppercase small fw-bold letter-spacing-1">Causes Supported</p>
        </div>
      </div>
      <div className="col-md-4">
        <div className="glass-card h-100 text-center p-4">
          <h3 className="text-accent display-4 fw-bold mb-0">{stats.activeParticipations}</h3>
          <p className="text-muted text-uppercase small fw-bold letter-spacing-1">Active Participations</p>
        </div>
      </div>
      <div className="col-12">
        <div className="glass-card p-4">
          <h4 className="mb-4">Recent Activity</h4>
          {stats.recentActivity && stats.recentActivity.length > 0 ? (
            <div className="list-group list-group-flush bg-transparent">
              {stats.recentActivity.map((activity, index) => (
                <div key={index} className="list-group-item bg-transparent border-bottom border-secondary px-0 py-3" style={{ color: 'var(--cc-text)' }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1">Joined: {activity.activity.title}</h6>
                      <small className="text-muted">{new Date(activity.createdAt).toLocaleDateString()}</small>
                    </div>
                    <span className={`badge ${activity.status === 'accepted' ? 'bg-success' : 'bg-warning'} bg-opacity-25 text-${activity.status === 'accepted' ? 'success' : 'warning'} rounded-pill`}>
                      {activity.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted">No recent activity.</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderOrganizationOverview = () => (
    <div className="row g-4">
      <div className="col-md-6">
        <div className="glass-card h-100 text-center p-4">
          <h3 className="text-accent display-4 fw-bold mb-0">{stats.activeVolunteers}</h3>
          <p className="text-muted text-uppercase small fw-bold letter-spacing-1">Active Volunteers</p>
        </div>
      </div>
      <div className="col-md-6">
        <div className="glass-card h-100 text-center p-4">
          <h3 className="text-accent display-4 fw-bold mb-0">{stats.impactHoursCreated}</h3>
          <p className="text-muted text-uppercase small fw-bold letter-spacing-1">Impact Hours Created</p>
        </div>
      </div>
      <div className="col-12">
        <div className="glass-card p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="mb-0">Active Opportunities</h4>
            <h4 className="mb-0">Active Opportunities</h4>
            <button 
              className="btn btn-sm btn-primary-glow"
              onClick={() => {
                setEditingId(null);
                setNewActivity({ title: '', description: '', date: '', duration: '', location: '', privateDetails: '', externalLink: '' });
                setShowCreateModal(true);
              }}
            >
              Create New
            </button>
          </div>
          
          {showCreateModal && (
            <div className="mb-4 p-4 border rounded border-secondary bg-dark bg-opacity-50">
              <h5 className="mb-3">{editingId ? 'Edit Opportunity' : 'Create New Opportunity'}</h5>
              <form onSubmit={handleSaveActivity}>
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    required
                    value={newActivity.title}
                    onChange={e => setNewActivity({...newActivity, title: e.target.value})}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea 
                    className="form-control" 
                    rows="3" 
                    required
                    value={newActivity.description}
                    onChange={e => setNewActivity({...newActivity, description: e.target.value})}
                  ></textarea>
                </div>
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Date</label>
                    <input 
                      type="date" 
                      className="form-control" 
                      required
                      value={newActivity.date}
                      onChange={e => setNewActivity({...newActivity, date: e.target.value})}
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Duration (Hours)</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      required
                      min="0.5"
                      step="0.5"
                      value={newActivity.duration}
                      onChange={e => setNewActivity({...newActivity, duration: e.target.value})}
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Location</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      required
                      value={newActivity.location}
                      onChange={e => setNewActivity({...newActivity, location: e.target.value})}
                    />
                  </div>
                  <div className="col-12 mb-3">
                    <label className="form-label">Private Details (Visible to accepted volunteers only)</label>
                    <textarea 
                      className="form-control" 
                      rows="2" 
                      placeholder="Meeting point, contact number, etc."
                      value={newActivity.privateDetails}

                      onChange={e => setNewActivity({...newActivity, privateDetails: e.target.value})}
                    ></textarea>
                  </div>
                  <div className="col-12 mb-3">
                    <label className="form-label">External Link (Optional)</label>
                    <input 
                      type="url" 
                      className="form-control" 
                      placeholder="https://paypal.me/donate or https://forms.gle/..."
                      value={newActivity.externalLink}
                      onChange={e => setNewActivity({...newActivity, externalLink: e.target.value})}
                    />
                    <small className="text-muted">Add a link to a donation page, signup form, or more info.</small>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary-glow">{editingId ? 'Update Opportunity' : 'Create Opportunity'}</button>
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="list-group list-group-flush bg-transparent">
            {activities.map(activity => (
              <div key={activity._id} className="list-group-item bg-transparent border-bottom border-secondary px-0 py-3" style={{ color: 'var(--cc-text)' }}>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">{activity.title}</h6>
                    <small className="text-muted">{new Date(activity.date).toLocaleDateString()} • {activity.location}</small>
                    <p className="mb-0 small">{activity.description}</p>
                    {activity.privateDetails && (
                       <div className="mt-2 p-2 rounded bg-success bg-opacity-10 border border-success">
                         {/* ALBERTO: Improved visibility of volunteer info */}
                         <small className="text-success fw-bold d-block mb-1">ℹ️ Volunteer Info:</small>
                         <small className="text-dark">{activity.privateDetails}</small>
                       </div>

                    )}
                    {activity.externalLink && (
                       <div className="mt-2">
                         <a href={activity.externalLink} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-info">
                           Visit External Link ↗
                         </a>
                       </div>
                    )}
                  </div>
                  {user.role === 'organization' ? (
                    // JUAN: Added manage button for orgs to view volunteers
                    <div className="d-flex gap-2">
                      <button 
                        className="btn btn-outline-light btn-sm"
                        onClick={() => startEdit(activity)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-outline-dark btn-sm"
                        onClick={() => handleManage(activity)}
                      >
                        Manage
                      </button>
                    </div>
                  ) : (
                    <span className={`badge ${activity.participationStatus === 'accepted' ? 'bg-success' : 'bg-primary'} bg-opacity-25 text-${activity.participationStatus === 'accepted' ? 'success' : 'primary'}`}>
                      {activity.participationStatus === 'accepted' ? 'Accepted' : 'Joined'}
                    </span>
                  )}
                </div>
              </div>
            ))}
            {activities.length === 0 && (
               <p className="text-muted text-center py-3">No active opportunities.</p>
            )}
          </div>

          {managingActivity && (
            <div className="mt-4 glass-card p-4 border border-primary bg-dark bg-opacity-75">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Managing: {managingActivity.title}</h5>
                <button className="btn btn-sm btn-outline-secondary" onClick={() => setManagingActivity(null)}>Close</button>
              </div>
              <div className="table-responsive">
                <table className="table table-dark table-hover bg-transparent">
                  <thead>
                    <tr>
                      <th>Volunteer</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participants.length > 0 ? participants.map(p => (
                      <tr key={p._id}>
                        <td>{p.volunteer.name}</td>
                        <td>{p.volunteer.email}</td>
                        <td>
                          <span className={`badge ${p.status === 'accepted' ? 'bg-success' : p.status === 'rejected' ? 'bg-danger' : 'bg-warning text-dark'}`}>
                            {p.status}
                          </span>
                        </td>
                        <td>
                          {p.status === 'pending' && (
                            <div className="btn-group btn-group-sm">
                              <button className="btn btn-success" onClick={() => handleUpdateStatus(p._id, 'accepted')}>Accept</button>
                              <button className="btn btn-danger" onClick={() => handleUpdateStatus(p._id, 'rejected')}>Reject</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="4" className="text-center text-muted">No volunteers yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return user.role === 'organization' ? renderOrganizationOverview() : renderVolunteerOverview();
      case 'bookmarks':
        return (
          <div className="row g-4">
            {bookmarks.length > 0 ? bookmarks.map((bookmark) => (
              <div className="col-md-6 col-lg-4" key={bookmark._id}>
                <div className="glass-card h-100 p-0 overflow-hidden">
                  <div style={{ height: '150px', background: `url(${bookmark.imageUrl}) center/cover` }}></div>
                  <div className="p-4">
                    <h5 className="mb-2 text-truncate">{bookmark.title}</h5>
                    <button 
                      className="btn btn-sm btn-outline-danger rounded-pill px-3 mt-2"
                      onClick={async () => {
                        try {
                          const token = localStorage.getItem('token');
                          await axios.delete(`/api/user/bookmarks/${bookmark.projectId}`, {
                            headers: { Authorization: `Bearer ${token}` }
                          });
                          setBookmarks(bookmarks.filter(b => b.projectId !== bookmark.projectId));
                        } catch (err) {
                          console.error('Error removing bookmark:', err);
                        }
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-12 text-center text-muted">
                <p>No bookmarks yet.</p>
                <a href="/directory" className="btn btn-primary-glow">Browse Projects</a>
              </div>
            )}
          </div>
        );
      case 'activities':
        return (
          <div className="glass-card p-4">
            <h4 className="mb-4">My Activities</h4>
            {activities.length > 0 ? (
              <div className="list-group list-group-flush bg-transparent">
                {activities.map(activity => (
                  <div key={activity._id} className="list-group-item bg-transparent border-bottom border-secondary px-0 py-3" style={{ color: 'var(--cc-text)' }}>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1">{activity.title}</h6>
                        <small className="text-muted">{new Date(activity.date).toLocaleDateString()} • {activity.location}</small>
                        <p className="mb-0 small">{activity.description}</p>
                        {activity.privateDetails && (
                           <div className="mt-2 p-2 rounded bg-success bg-opacity-10 border border-success">
                             <small className="text-success fw-bold d-block mb-1">ℹ️ Volunteer Info:</small>
                             <small className="text-light">{activity.privateDetails}</small>
                           </div>
                        )}
                      </div>
                      <span className={`badge ${activity.participationStatus === 'accepted' ? 'bg-success' : 'bg-primary'} bg-opacity-25 text-${activity.participationStatus === 'accepted' ? 'success' : 'primary'}`}>
                        {activity.participationStatus === 'accepted' ? 'Accepted' : 'Joined'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
               <div className="alert alert-info bg-opacity-10 border-info text-info">
                You haven't joined any activities yet. <a href="/directory" className="text-info fw-bold">Browse Directory</a>
              </div>
            )}
          </div>
        );
      case 'subscribers':
        return (
           <div className="glass-card p-4">
            <h4 className="mb-4">Recent Subscribers</h4>
            <div className="row g-3">
              {stats.recentSubscribers && stats.recentSubscribers.length > 0 ? (
                stats.recentSubscribers.map((sub) => (
                  <div className="col-md-6" key={sub._id}>
                    <div className="d-flex align-items-center p-3 border rounded" style={{ borderColor: 'var(--border-subtle)' }}>
                      <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white me-3" style={{ width: '40px', height: '40px' }}>
                        {sub.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h6 className="mb-0">{sub.name}</h6>
                        <small className="text-muted">Joined {new Date(sub.joinedAt).toLocaleDateString()} via {sub.activityTitle}</small>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12 text-center text-muted">
                  <p>No subscribers yet.</p>
                </div>
              )}
            </div>
           </div>
        );
      case 'settings':
        return (
          <div className="glass-card p-4" style={{ maxWidth: '600px' }}>
            <h4 className="mb-4">{user.role === 'organization' ? 'Organization Profile' : 'Profile Settings'}</h4>
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                const token = localStorage.getItem('token');
                const name = e.target.name.value;
                const bio = e.target.bio.value;
                
                const res = await axios.put('/api/auth/profile', 
                  { name, bio },
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                
                setUser({ ...user, name, bio });
                localStorage.setItem('user', JSON.stringify({ ...user, name, bio }));
                alert('Profile updated successfully!');
              } catch (err) {
                alert('Failed to update profile');
              }
            }}>
              <div className="mb-3">
                <label className="form-label text-muted small text-uppercase fw-bold">
                  {user.role === 'organization' ? 'Organization Name' : 'Full Name'}
                </label>
                <input 
                  type="text" 
                  name="name"
                  className="form-control" 
                  defaultValue={user.name} 
                  style={{ background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.1)', color: 'var(--cc-text)' }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label text-muted small text-uppercase fw-bold">Email Address</label>
                <input 
                  type="email" 
                  className="form-control" 
                  defaultValue={user.email} 
                  disabled 
                  style={{ background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.1)', color: 'var(--cc-text)' }}
                />
              </div>
              <div className="mb-4">
                <label className="form-label text-muted small text-uppercase fw-bold">
                   {user.role === 'organization' ? 'Mission Statement' : 'Bio'}
                </label>
                <textarea 
                  name="bio"
                  className="form-control" 
                  rows="3" 
                  defaultValue={user.bio || ''}
                  placeholder="Tell us about yourself..."
                  style={{ background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.1)', color: 'var(--cc-text)' }}
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary-glow">Save Changes</button>
            </form>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="page-section" style={{ minHeight: '100vh', paddingTop: '120px' }}>
      <div className="container-xl">
        <div className="row">
          {/* Sidebar / User Profile */}
          <div className="col-lg-3 mb-4 mb-lg-0">
            <div className="glass-card p-4 text-center sticky-top" style={{ top: '100px' }}>
              <div 
                className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center fw-bold display-4 shadow-lg"
                style={{ width: '100px', height: '100px', background: 'var(--gradient-accent)', color: '#fff' }}
              >
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <h4 className="mb-1">{user.name}</h4>
              <p className="text-muted small mb-2">{user.email}</p>
              <span className="badge bg-primary bg-opacity-10 text-primary mb-4 text-uppercase letter-spacing-1" style={{ fontSize: '0.7rem' }}>
                {user.role}
              </span>
              
              <div className="d-grid gap-2">
                <button 
                  className={`btn ${activeTab === 'overview' ? 'btn-primary-glow' : 'btn-outline-dark border-0 text-start'}`}
                  onClick={() => setActiveTab('overview')}
                >
                  Overview
                </button>
                
                {user.role === 'organization' ? (
                   <>
                    <button 
                      className={`btn ${activeTab === 'subscribers' ? 'btn-primary-glow' : 'btn-outline-dark border-0 text-start'}`}
                      onClick={() => setActiveTab('subscribers')}
                    >
                      Subscribers
                    </button>
                   </>
                ) : (
                  <>
                    <button 
                      className={`btn ${activeTab === 'bookmarks' ? 'btn-primary-glow' : 'btn-outline-dark border-0 text-start'}`}
                      onClick={() => setActiveTab('bookmarks')}
                    >
                      Bookmarks
                    </button>
                    <button 
                      className={`btn ${activeTab === 'activities' ? 'btn-primary-glow' : 'btn-outline-dark border-0 text-start'}`}
                      onClick={() => setActiveTab('activities')}
                    >
                      My Activities
                    </button>
                  </>
                )}

                <button 
                  className={`btn ${activeTab === 'settings' ? 'btn-primary-glow' : 'btn-outline-dark border-0 text-start'}`}
                  onClick={() => setActiveTab('settings')}
                >
                  Settings
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-lg-9">
            <div className="mb-4">
              <h2 className="text-gradient mb-0 text-capitalize">{activeTab.replace('-', ' ')}</h2>
            </div>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;