import axios from '@/api'

console.log(axios)

export const getPresentation = (id, success, failure) =>
  axios.get(`/presentations/${id}`).then(success).catch(failure)

export const savePresentation = (presentation, success, failure) => {
  if (presentation.id) {
    // Updating existing presentation
    return axios.put(`/presentations/${presentation.id}`).then(success).catch(failure)
  }
  // Create new presentation
  return axios.post('/presentations').then(success).catch(failure)
}

const presentations = [
  {
    id: 22,
    userId: 0,
    title: 'test title! 22',
    slides: [
      {
        backgroundColour: '#FFFFFF',
        elements: [
          {
            id: 0,
            type: 'TEXT',
            properties: {
              x: '30px',
              y: '30px',
              fill: '#000000',
              fontFamily: 'Verdana',
              fontSize: '20px',
              content: 'Title goes here'
            }
          },
          {
            id: 1,
            type: 'TEXT',
            properties: {
              x: '30px',
              y: '80px',
              fill: '#000000',
              fontFamily: 'Comic Sans MS',
              fontSize: '15px',
              content: 'Some other text'
            }
          },
          {
            id: 2,
            type: 'IMAGE',
            properties: {
              x: '265px',
              y: '45px',
              width: '150px',
              height: '150px',
              href: 'https://picsum.photos/150'
            }
          }
        ]
      },
      {
        backgroundColour: '#FF0000',
        elements: [
          {
            id: 0,
            type: 'TEXT',
            properties: {
              x: '100px',
              y: '200px',
              fill: '#000000',
              fontFamily: 'Trebuchet MS',
              fontSize: '30px',
              content: 'Slide 2'
            }
          }
        ]
      }
    ]
  }
]

export default {
  getPresentation (pId) {
    // Dummy promisified return to simulate fetching from DB
    return new Promise((resolve, reject) => {
      const result = presentations.find(p => p.id === parseInt(pId))

      return setTimeout(() => {
        Promise.resolve(result || null)
      }, 2000)
    })
  },
  getPresentationsForUser (userId) {
    return axios.get('/presentations')
  },
  savePresentation (presentation) => {
    if (presentation.id) {
    return axios.post(`/presentations/${presentation.id}`, presentation)
      .then(success).catch(failure)
    }
    return axios.post('/presentations/new', presentation).then(success).catch(failure)
  }
}
