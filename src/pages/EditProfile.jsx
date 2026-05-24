import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, User, Mail, Loader as Loader2 } from 'lucide-react'
import useUserStore from '../store/userStore'

export default function EditProfile() {
  const navigate = useNavigate()
  const { profile, isSaving, updateProfile } = useUserStore()

  const [formData, setFormData] = useState({ name: '', email: '' })
  const [errors, setErrors] = useState({})
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
      })
    }
  }, [profile])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setHasChanges(true)
    setErrors((prev) => ({ ...prev, [name]: null }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    const success = await updateProfile({
      name: formData.name,
      ...(formData.email ? { email: formData.email } : {}),
    })

    if (success) {
      navigate('/account')
    }
  }

  return (
    <div style={{ paddingTop: '4rem', paddingBottom: '10rem', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', marginBottom: '1.5rem' }}>
        <button
          onClick={() => navigate('/account')}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'white',
            border: '1px solid #E8F8F3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          <ChevronLeft size={20} style={{ color: '#033428' }} />
        </button>
        <h1 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#033428', margin: 0 }}>
          Edit Profile
        </h1>
      </div>

      {/* Avatar Section */}
      {profile && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: profile.avatarUrl
                ? `url(${profile.avatarUrl})`
                : 'linear-gradient(135deg, #0D9E7E 0%, #065443 100%)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '2rem',
              fontWeight: '900',
              boxShadow: '0 4px 12px rgba(13, 158, 126, 0.3)',
            }}
          >
            {!profile.avatarUrl && profile.name?.charAt(0).toUpperCase()}
          </div>
          <button
            onClick={() => {}}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#0D9E7E',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: 'not-allowed',
              opacity: 0.5,
            }}
          >
            Change Photo (Coming soon)
          </button>
        </div>
      )}

      {/* Form */}
      <div style={{ padding: '1rem' }}>
        {/* Full Name */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#033428', marginBottom: '0.5rem' }}>
            Full Name
          </label>
          <div style={{ position: 'relative' }}>
            <User size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#0D9E7E' }} />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={{
                width: '100%',
                height: '48px',
                borderRadius: '0.75rem',
                border: errors.name ? '1px solid #ef4444' : '1px solid #E8F8F3',
                backgroundColor: 'white',
                paddingLeft: '40px',
                paddingRight: '16px',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#033428',
                outline: 'none',
                transition: 'all 200ms',
              }}
              onFocus={(e) => {
                if (!errors.name) {
                  e.currentTarget.style.borderColor = '#0D9E7E'
                  e.currentTarget.style.boxShadow = '0 0 0 2px rgba(13, 158, 126, 0.1)'
                }
              }}
              onBlur={(e) => {
                if (!errors.name) {
                  e.currentTarget.style.borderColor = '#E8F8F3'
                  e.currentTarget.style.boxShadow = 'none'
                }
              }}
            />
          </div>
          {errors.name && <p style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: '600', marginTop: '0.25rem' }}>{errors.name}</p>}
        </div>

        {/* Email */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#033428', marginBottom: '0.5rem' }}>
            Email Address
          </label>
          <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginBottom: '0.75rem', margin: 0 }}>
            For order receipts and offers
          </p>
          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#0D9E7E' }} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              style={{
                width: '100%',
                height: '48px',
                borderRadius: '0.75rem',
                border: errors.email ? '1px solid #ef4444' : '1px solid #E8F8F3',
                backgroundColor: 'white',
                paddingLeft: '40px',
                paddingRight: '16px',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#033428',
                outline: 'none',
                transition: 'all 200ms',
              }}
              onFocus={(e) => {
                if (!errors.email) {
                  e.currentTarget.style.borderColor = '#0D9E7E'
                  e.currentTarget.style.boxShadow = '0 0 0 2px rgba(13, 158, 126, 0.1)'
                }
              }}
              onBlur={(e) => {
                if (!errors.email) {
                  e.currentTarget.style.borderColor = '#E8F8F3'
                  e.currentTarget.style.boxShadow = 'none'
                }
              }}
            />
          </div>
          {errors.email && <p style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: '600', marginTop: '0.25rem' }}>{errors.email}</p>}
        </div>

        {/* Phone (Read-only) */}
        {profile && (
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#033428', marginBottom: '0.5rem' }}>
              Phone Number
            </label>
            <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginBottom: '0.75rem', margin: 0 }}>
              Phone number cannot be changed
            </p>
            <div style={{ position: 'relative' }}>
              <input
                type="tel"
                value={profile.phone}
                disabled
                style={{
                  width: '100%',
                  height: '48px',
                  borderRadius: '0.75rem',
                  border: '1px solid #E8F8F3',
                  backgroundColor: '#f3f4f6',
                  paddingLeft: '40px',
                  paddingRight: '16px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#9CA3AF',
                  outline: 'none',
                }}
              />
              <div style={{ position: 'absolute', right: '12px', top: '12px', color: '#9CA3AF' }}>🔒</div>
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#f9fafb',
          borderTop: '1px solid #E8F8F3',
          padding: '1rem',
          maxWidth: '430px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        <button
          onClick={handleSubmit}
          disabled={!hasChanges || isSaving}
          style={{
            width: '100%',
            padding: '1rem',
            borderRadius: '1rem',
            background: !hasChanges ? '#D1D5DB' : 'linear-gradient(135deg, #0D9E7E 0%, #0A7560 100%)',
            color: 'white',
            border: 'none',
            fontWeight: '900',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            cursor: !hasChanges ? 'not-allowed' : 'pointer',
            transition: 'all 200ms',
          }}
          onMouseDown={(e) => {
            if (hasChanges && !isSaving) {
              e.currentTarget.style.transform = 'scale(0.95)'
            }
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
          }}
        >
          {isSaving && <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />}
          Save Changes
        </button>
      </div>
    </div>
  )
}
