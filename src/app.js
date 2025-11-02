import { h, Component } from 'preact'
import Header from './header'
import Repos from './repos'

const storageKey = 'angrytech'
const globalStyles = `
html, body {
  margin: 0;
  padding: 0;
  font-family: "Montserrat", "Helvetica Neue", "Noto Sans", sans-serif;
  box-sizing: border-box;
}
`

export default class App extends Component {
  constructor (props) {
    super(props)
    this.state = { repos: [] }
  }

  getFromStorage () {
    try {
      const data = JSON.parse(localStorage.getItem(storageKey))
      const now = new Date()
      const then = new Date(data.date)
      if ((now - then) / 36e5 <= 24) {
        return Promise.resolve(data.repos)
      }
      return Promise.resolve([])
    } catch (_) {
      return Promise.resolve([])
    }
  }

  setInStorage (repos) {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ repos, date: new Date() }))
    } catch (_) {}
  }

  mapToState (rs) {
    // .filter((r) => !r.fork && !r.archived)
    const repos = rs
      .map(
        ({
          description,
          html_url: url,
          language,
          name,
          stargazers_count: stars
        }) => ({
          description,
          language,
          name,
          stars,
          url
        })
      )
      .sort((a, b) => b.stars - a.stars)

    this.setInStorage(repos)
    this.setState({ repos })
  }

  fetchAllRepos () {
    return fetch('https://api.github.com/users/zautumnz/repos?sort=updated')
      .then((res) => {
        const links = res.headers.get('link').split(',')
        const totalPages = links.find((el) => el.includes('last'))
        const pageAmount = totalPages.match(/page=(\d)/)[1]
        const buildLinks = (n) =>
          Array.from({ length: n }, (_, i) =>
            `https://api.github.com/users/zautumnz/repos?sort=updated&page=${i + 1}`
          )

        const fetches = buildLinks(pageAmount)
          .map((repo) => fetch(repo).then((b) => b.json()))

        const mapRepos = (cb) =>
          Promise.all(fetches)
            .then((chunks) => {
              const repos = [].concat.apply([], chunks)
              cb(repos)
            })

        return mapRepos((stuff) => {
          this.mapToState(stuff)
        })
      })
  }

  componentDidMount () {
    const style = document.createElement('style')
    style.innerHTML = globalStyles
    document.head.appendChild(style)

    this.getFromStorage()
      .then((repos) => {
        if (repos && repos.length) {
          this.setState({ repos })
        } else {
          this.fetchAllRepos()
        }
      })
  }

  render () {
    return (
      <div>
        <Header />
        <Repos repos={this.state.repos} />
      </div>
    )
  }
}
