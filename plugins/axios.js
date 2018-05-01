import axios from 'axios'

let options = {}
if (process.server) {
  options.baseURL = 'http://www.binlive.cn/'
}

export default axios.create(options)
