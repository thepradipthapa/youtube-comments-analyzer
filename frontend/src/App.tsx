import { useState } from 'react'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useMutation, useQuery } from '@tanstack/react-query'


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
      <div className='min-vh-100 d-flex flex-column'>
        {/* Header */}
        <header className=''>
          <div className='container py-4 text-center'>
            <div className='d-flex align-items-center gap-3 justify-content-center'>
              <i className='bi bi-youtube text-danger fs-1'></i>
              <h1 className='mb-0'>YouTube Comments Analyzer</h1>
            </div>
            <p className='text-muted small mt-2'>
              Analyze and categorize YouTube video comments with AI
            </p>
          </div>
        </header>
      
      {/* Main Content */}
        <div className='container  my-3 py-3 justify-content-center text-center'>
          <div className='mt-4 row justify-content-center align-items-center g-3'> 
            <div className='col-auto'>
              <label htmlFor="videoUrl" className='col-form-label'>
                Video URL :
              </label>
            </div>
            <div className='col-auto col-sm-6'>
              <input 
              type="text" 
              className='form-control' 
              placeholder='Enter YouTube video URL which, you want to analyze'
              onChange={(e) => setUrl(e.target.value)}
              value={url}
              />
            </div>
          </div>
          <button
            className='btn btn-primary mt-3'
            onClick={() => mutation.mutate(url)}
            disabled={mutation.isPending || !url.trim()}
          >
            {mutation.isPending ? (
              <>
                <span className='spinner-border spinner-border-sm me-2' role='status'></span>
                Analyzing...
              </>
            ) : (
              <>
                <i className='bi bi-play-circle me-2'></i>
                Analyze
              </>
            )}
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

          {/* Display Completed Results */}
          {data?.status === 'completed' && (
            <div className='mt-5'>
              <h2 className='mb-4'>
                <i className='bi bi-check-circle-fill text-success me-2'></i>
                Analysis Complete
              </h2>

            {/* Total Comments Summary */}
            <div className='row mb-5'>
              <div className='col-12'>
                <div className='card bg-light border-0'>
                  <div className='card-body text-center py-4'>
                    <h4 className='text-primary fw-bold mb-2'>
                      {Object.values(data.data).reduce((sum, arr) => sum + arr.length, 0)}
                    </h4>
                    <p className='text-muted mb-0'>
                      Total Comments Analyzed • 
                      <span className='fw-semibold ms-2'>
                        {Object.keys(data.data).length} Categories
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
              
              <div className='row justify-content-center'>
                {Object.keys(data.data).length === 0 ? (
                  <div className='col-12'>
                    <div className='alert alert-info'>
                      No comments found for this video.
                    </div>
                  </div>
                ) : (
                  Object.keys(data.data).map((category) => (
                    <div key={category} className='col-md-6 col-lg-4 mb-4 '>
                      <div className='card h-100 shadow-sm'>
                        <div className='card-header bg-success text-white'>
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
                  className='btn btn-outline-danger'
                  onClick={() => {
                    setUrl('')
                    setTaskId('')
                  }}
                >
                  Analyze Next Video
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className='border-top py-4 mt-auto'>
        <div className='container text-center text-muted small'>
          <p className='mb-0'>
            YouTube Comments Analyzer • Powered by AI
          </p>
        </div>
      </footer>
      <ReactQueryDevtools />
    </>
  )
}

export default App
