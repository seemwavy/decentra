import React from 'react'
import Link from 'next/link'
import styles from './styles.module.scss'

export default function PostFeed({posts, admin}) {
  return posts ? posts.map((post) => <PostItem post={post} key={post.slug} admin={admin}/>) : null;
}

function PostItem({post, admin = false}){
  const wordCount = post?.content.trim().split(/\s+/g).length;

  const contentPreview = post?.content.trim().split(/\s+/g).map((word, i) => {
    let preview = [];
    if(i < 15 && word.length < 15){
      preview.push(word)
    }
    return preview
  })
  const minutesToRead = (wordCount / 100 + 1).toFixed(0);

  return (
    <div className={styles.container}>
      <Link href={`/${post.username}`}>
        <a className={styles.user_nav}> 
          <strong>By @{post.username}</strong>
        </a>
      </Link>

      <Link href={`/${post.username}/${post.slug}`}>
        <h2 className={styles.post_title}>
          <a>{post.title}</a>
        </h2>
      </Link>

      <p className={styles.para}>
        {contentPreview.join(' ')}...
      </p>

      <footer>
        <span className={styles.top_corner}>
          {wordCount} words. {minutesToRead} min read
        </span>

        <span className={styles.likes}>
          {post.heartCount} Likes
        </span>
      </footer>
    </div>
  )
}
