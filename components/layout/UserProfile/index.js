import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import EditProfileModal from './EditProfileModal';
import { UserContext } from "../../../lib/context";
import styles from './styles.module.scss'
import ReactMarkdown from 'react-markdown';

// UI component for user profile
export default function UserProfile({ user }) {
  const { username } = useContext(UserContext);
  const router = useRouter();
  const admin = router.query;

  const [editor, setEditor] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  useEffect(() => {
    if(admin.username === username){
      setEditor(true)
    }
  }, [])

  return (
    <div className={styles.profile}>
      <div className={styles.banner}>
        <ReactMarkdown>{user?.banner}</ReactMarkdown>
      </div>
 
      <div className={styles.pfp}>
        <ReactMarkdown>{user?.photoURL}</ReactMarkdown>
      </div>

      <div className={styles.profileGrid}>
        <main>
          <h1>{user.displayName || 'Anonymous User'}</h1>
          <p>
            <i>@{user.username}</i>
          </p>
          <br />
          <p>
            {user?.bio}
          </p>
        </main>

        <a href={"https://www.google.com"} target={"_blank"}> google.com </a>
      </div>
      
      <div className={styles.toolbar}>
        <button>Share</button>
        <button>Connect</button>
        <button>More</button>

        {
          editor ? <button onClick={() => setEditOpen(true)}>Edit</button> : ''
        }
      </div>

      {
        editOpen ? 
        <EditProfileModal user={user} handleOnClick={() => setEditOpen(false)}/>
        :
        ''
      }
    </div>
  );
}