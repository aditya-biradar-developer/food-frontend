import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const RoleToggle = () => {
  const { user, switchUserRole } = useAuth();
  const navigate = useNavigate();

  const handleRoleChange = async (newRole) => {
    const result = await switchUserRole(newRole);
    
    if (result.success) {
      if (newRole === 'owner') {
        navigate('/owner/dashboard');
      } else {
        navigate('/');
      }
    } else if (result.requiresSetup) {
      // Redirect to restaurant setup
      navigate('/setup-restaurant');
    } else {
      alert(result.message || 'Failed to switch role');
    }
  };

  return (
    <div className="role-toggle">
      <span className="role-label">Switch Role:</span>
      <div className="toggle-buttons">
        <button
          className={`toggle-btn ${user?.role === 'user' ? 'active' : ''}`}
          onClick={() => handleRoleChange('user')}
        >
          User
        </button>
        <button
          className={`toggle-btn ${user?.role === 'owner' ? 'active' : ''}`}
          onClick={() => handleRoleChange('owner')}
        >
          Owner
        </button>
      </div>
    </div>
  );
};

export default RoleToggle;