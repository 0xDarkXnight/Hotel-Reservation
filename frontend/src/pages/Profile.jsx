import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Edit3, Check, X } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Alert from '../components/ui/Alert';
import { getInitials } from '../utils/helpers';

export default function Profile() {
  const { user, updateProfile, loading } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ firstName: user?.firstName || '', lastName: user?.lastName || '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSave = async () => {
    setError(''); setSuccess('');
    try { await updateProfile(form); setEditing(false); setSuccess('Profile updated!'); }
    catch (err) { setError(err.message || 'Failed to update profile'); }
  };
  const handleCancel = () => { setForm({ firstName: user?.firstName || '', lastName: user?.lastName || '' }); setEditing(false); };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      className="page-container-narrow py-12 sm:py-16 lg:py-20" style={{ maxWidth: '780px' }}>

      <h1 className="heading-section text-center mb-12 lg:mb-14">Profile</h1>

      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} className="mb-8" autoClose={4000} />}
      {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-8" />}

      <Card className="mb-8">
        <div className="flex flex-col sm:flex-row items-center gap-8">
          <div className="w-28 h-28 bg-gradient-to-br from-gold-500 to-gold-600 rounded-2xl flex items-center justify-center text-dark-950 text-3xl font-extrabold shadow-xl shadow-gold-500/20 flex-shrink-0">
            {getInitials(user?.firstName, user?.lastName)}
          </div>
          <div className="text-center sm:text-left">
            <h2 className="heading-subsection mb-1">{user?.firstName} {user?.lastName}</h2>
            <p className="text-body-sm">{user?.email}</p>
            <div className="mt-3">
              {user?.isAdmin ? <Badge variant="primary" size="md" dot>Administrator</Badge> : <Badge variant="default" size="md">Guest Member</Badge>}
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-slate-100">Personal Information</h3>
          {!editing ? (
            <Button variant="ghost" size="md" icon={Edit3} onClick={() => setEditing(true)}>Edit</Button>
          ) : (
            <div className="flex gap-3">
              <Button variant="ghost" size="md" icon={X} onClick={handleCancel}>Cancel</Button>
              <Button variant="primary" size="md" icon={Check} onClick={handleSave} loading={loading}>Save</Button>
            </div>
          )}
        </div>

        {editing ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input label="First Name" icon={User} value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} minLength={2} required />
            <Input label="Last Name" icon={User} value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} minLength={2} required />
          </div>
        ) : (
          <div className="space-y-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[['First Name', user?.firstName, User], ['Last Name', user?.lastName, User]].map(([label, value, Icon]) => (
                <div key={label}>
                  <label className="text-caption">{label}</label>
                  <div className="flex items-center gap-2.5 mt-2.5"><Icon className="h-4 w-4 text-slate-600" /><span className="text-slate-200 font-medium text-lg">{value}</span></div>
                </div>
              ))}
            </div>
            <div>
              <label className="text-caption">Email</label>
              <div className="flex items-center gap-2.5 mt-2.5"><Mail className="h-4 w-4 text-slate-600" /><span className="text-slate-200 font-medium text-lg">{user?.email}</span></div>
            </div>
            <div>
              <label className="text-caption">Role</label>
              <div className="flex items-center gap-2.5 mt-2.5"><Shield className="h-4 w-4 text-slate-600" /><span className="text-slate-200 font-medium text-lg">{user?.isAdmin ? 'Administrator' : 'Guest'}</span></div>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
