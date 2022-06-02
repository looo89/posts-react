import React, { useEffect, useMemo, useRef, useState } from 'react';
import PostForm from './../components/PostForm';
import PostFilter from './../components/PostFilter';
import MyModal from './../components/UI/MyModal/MyModal';
import MyButton from './../components/UI/button/MyButton';
import { usePosts } from './../hooks/usePosts';
import PostService from './../API/PostService';
import Loader from './../components/UI/Loader/Loader';
import { useFitching } from './../hooks/useFetching';
import { getPageCount, getPagesArray } from './../components/utils/pages';
import Pagination from './../components/UI/pagination/Pagination';
import PostList from '../PostList';
import { useObserver } from '../hooks/useObserver';
import MySelect from '../components/UI/select/MySelect';


function Posts() {
  const [posts, setPosts]=useState([])
  const [filter, setFilter] = useState({sort: '', query: ''})
  const [modal, setModal] = useState(false)
  const sortedAndSearchedPosts = usePosts(posts, filter.sort, filter.query)

  const [totalPages, setTotalPages]= useState(0)
  const [limit, setLimit]= useState(10)
  const [page, setPage]=useState(1)

  const lastElement=useRef()

  const [fetchPosts, isPostsLoading, postError]= useFitching( async(limit, page)=>{ 
    const responce= await PostService.getAll(limit, page)
    setPosts([...posts, ...responce.data])
    const totalCount=responce.headers['x-total-count']
    setTotalPages(getPageCount(totalCount, limit))
  })

 
  useObserver(lastElement, page<totalPages, isPostsLoading, ()=>{
    setPage(page+1)
  })

  useEffect(()=>{
    fetchPosts(limit, page)
  }, [page, limit])

  const createPost=(newPost)=>{
    setPosts([...posts, newPost])
    setModal(false)
  }

  const removePost=(post)=>{
    setPosts(posts.filter(p=>p.id !== post.id))
  }

  const changePage = (page)=>{
    setPage(page)
  }

  return (
    <div className='App'>
      <button onClick={fetchPosts}>GET POSTS</button>
      <MyButton style={{marginTop: 30}} onClick={()=>setModal(true)}>
        создать пост
      </MyButton>
      <MyModal visible={modal} setVisible={setModal}>
        <PostForm create={createPost}/>
      </MyModal>
      <hr style={{margin: '15px 0'}}/>
      <PostFilter filter={filter} setFilter={setFilter}/>
      <MySelect
        value={limit}
        onChange={value=>setLimit(value)}
        defaultValue='Колличество элементов на странице'
        options={[
          {value: 5, name: '5'},
          {value: 10, name: '10'},
          {value: 20, name: '20'},
          {value: -1, name: 'Показать всё'},
        ]}
        />

      {postError && <h1>Произошла ошибка ${postError}</h1>}

      <PostList remove={removePost} posts={sortedAndSearchedPosts} title='список постов '/> 
      
      <div ref={lastElement} style={{height:20 }}></div>
      
      {isPostsLoading &&
        <div style={{display: 'flex', justifyContent: 'center', marginTop: 50}}>
          <Loader/>
        </div>
      }
      <Pagination 
        page={page} 
        changePage={changePage} 
        totalPages={totalPages}
      />

    </div>
  );
}

export default Posts;