import { useState } from 'react'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useMutation, Query, useQuery } from '@tanstack/react-query'
import './App.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

type Task = {
  task_id: string;
}


async function AnalyzeComments(url: string): Promise<Task> {
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url: url }),
  });
  if (!response.ok) {
    throw new Error('Failed to analyze comments');
  }
  return response.json();
}

type TaskStatus = {
  task_id: string;
  status: string;
  data: { [key: string]: Comment[] };
}


type Comment = {
  id: string;
  category: string;
  text: string;
}


async function GetTaskStatus(task_id: string): Promise<TaskStatus> {
  const response = await fetch(`${API_BASE_URL}/status/${task_id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch task status');
  }
  return response.json();
}

function App() {
  const [url, setUrl] =  useState('')
  const [task_id, setTaskId] = useState('')

  const mutation = useMutation({
    mutationFn: AnalyzeComments,
    onSuccess: (data: Task) => {
      setTaskId(data.task_id)
    }
  })

  const { data } = useQuery<TaskStatus>({
    queryKey: ['status', task_id],
    queryFn: () => GetTaskStatus(task_id),
    enabled: !!task_id,

    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === 'completed' ? false : 2000;
      }
  })
  return (
    <>
      <header className="App-header">
        <h1>YouTube Comments Analyzer</h1>
      </header>
      <div className='mt-4 row '> 
        <div className='col-auto'>
          <label htmlFor="videoUrl" className='col-form-label'>
            Video URL :
          </label>
        </div>
        <div className='col-auto col-sm-10'>
          <input 
          type="text" 
          className='form-control' 
          placeholder='Enter Your Youtube Video URL'
          onChange={(e) => setUrl(e.target.value)}
          value={url}
          />
        </div>
      </div>
      <button 
        className='btn btn-primary mt-3' 
        onClick={() => mutation.mutate(url)}
        disabled={mutation.isPending || !url.trim() }
        >
        {mutation.isPending ? 'Analyzing...' : 'Analyze'}
      </button>
      


      



      {/* Display Processing State */}
      {data?.status === 'processing' && (
        <div className='mt-5 text-center'>
          <div className='spinner-border text-primary' role='status'>
            <span className='visually-hidden'>Loading...</span>
          </div>
          <p className='mt-3 text-muted'>Analyzing comments...</p>
        </div>
      )}

      {/* Display Error State */}
      {data?.status === 'error' && (
        <div className='mt-4 alert alert-danger alert-dismissible fade show' role='alert'>
          <h4 className='alert-heading'>Analysis Failed</h4>
          <p>{data.message || 'An error occurred while analyzing comments.'}</p>
          <button type='button' className='btn-close' onClick={() => setTaskId('')}></button>
        </div>
      )}

      {/* Display Completed Results */}
      {data?.status === 'completed' && (
        <div className='mt-5'>
          <h2 className='mb-4'>
            <i className='bi bi-check-circle-fill text-success me-2'></i>
            Analysis Complete
          </h2>
          
          <div className='row'>
            {Object.keys(data.data).length === 0 ? (
              <div className='col-12'>
                <div className='alert alert-info'>
                  No comments found for this video.
                </div>
              </div>
            ) : (
              Object.keys(data.data).map((category) => (
                <div key={category} className='col-md-6 col-lg-4 mb-4'>
                  <div className='card h-100 shadow-sm border-0'>
                    <div className='card-header bg-primary text-white'>
                      <h5 className='mb-0'>
                        {category}
                        <span className='badge bg-light text-primary float-end'>
                          {data.data[category].length}
                        </span>
                      </h5>
                    </div>
                    <div className='card-body'>
                      <div className='comments-list'>
                        {data.data[category].map((item) => (
                          <div key={item.id} className='mb-3 pb-3 border-bottom'>
                            <p className='mb-2 text-break'>
                              {/* <small className='text-muted d-block mb-1'>ID: {item.id}</small> */}
                              {item.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Reset Button */}
          <div className='mt-4'>
            <button 
              className='btn btn-outline-secondary'
              onClick={() => {
                setUrl('')
                setTaskId('')
              }}
            >
              Analyze Another Video
            </button>
          </div>
        </div>
      )}
      <ReactQueryDevtools />
    </>
  )
}

export default App
