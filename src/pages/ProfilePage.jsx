import { useAuth } from '../lib/AuthContext'
// import { supabase } from '../lib/supabase'

export default function ProfilePage() {
  const { user } = useAuth()

  // TODO: fetch user's posts from Supabase
  // const [posts, setPosts] = useState([])
  // useEffect(() => { ... }, [user])

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      <h1 className="page-title">My Profile</h1>

      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Avatar placeholder */}
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'var(--red)', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem', fontWeight: 700
          }}>
            {user?.email?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>
              {/* TODO: display username from users table */}
              {user?.user_metadata?.username ?? user?.email}
            </p>
            <p style={{ color: 'var(--ink-faint)', fontSize: '0.85rem' }}>{user?.email}</p>
          </div>
        </div>

        <hr className="divider" />

        <div style={{ display: 'flex', gap: 10 }}>
          {/* TODO: implement avatar upload */}
          <button className="btn btn-ghost btn-sm">Change Avatar</button>
          {/* TODO: implement username/profile edit */}
          <button className="btn btn-ghost btn-sm">Edit Profile</button>
        </div>
      </div>

      <h2 style={{ fontWeight: 700, marginBottom: 12, fontSize: '1.05rem' }}>My Posts</h2>
      <div className="empty-state card">
        <p>Your posts will appear here.</p>
        <p style={{ fontSize: '0.85rem' }}>
          Connect Supabase and query <code>experience_posts</code> where <code>author_id = user.id</code>.
        </p>
      </div>
    </div>
  )
}
