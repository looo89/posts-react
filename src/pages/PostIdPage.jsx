

import React, { useEffect, useState } from 'react';
import {useParams} from 'react-router-dom'
import PostService from '../API/PostService';
import Loader from '../components/UI/Loader/Loader';
import { useFitching } from '../hooks/useFetching';


function PostIdPage() {
    const params=useParams()
    const [post, setPost]= useState({})
    const [comments, setComment]=useState([])

    const [fetchPostById, isLoading, error]= useFitching(async(id)=>{
        const response=await PostService.getById(id)
        setPost(response.data)
    })
    const [fetchComments, isComLoading, comError]= useFitching(async(id)=>{
      const response=await PostService.getCoomentsById(id)
      setComment(response.data)
  })

    useEffect(()=>{
        fetchPostById(params.id)
        fetchComments(params.id)
    }, [])
    
  return(
    <div>
        <h1>Вы открыли страницу поста с id = {params.id}</h1>
        {isLoading
          ?<Loader/>
          : <div>{post.id}.  {post.title}</div>
        }
        <h1>Комментарии</h1>
        {isComLoading
          ?<Loader/>
          : <div>
              {comments.map(comm=>
                <div key={comm.id}>
                  <h4>{comm.email}</h4>
                  <div>{comm.body}</div>
                </div>)}
            </div>
        }
    </div>
  )
}

export default PostIdPage;

