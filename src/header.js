import { h } from 'preact'

const styles = `
header {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  box-shadow: 1px 1px 2px #999;
  top: 0px;
  left: 0px;
  width: 100%;
  position: fixed;
  padding: 8px;
  background: white;
  z-index: 3;
}
header a, header a:visited {
  color: #079941;
  text-decoration: none;
}
header a:hover, header a:focus, header a:active {
  text-decoration: underline;
}
`

const Header = () => (
  <header>
    <style dangerouslySetInnerHTML={{ __html: styles }} />
    <a href="https://github.com/zautumnz" target="_blank" rel="noopener noreferrer">
      zautumnz on github
    </a>
  </header>
)

export default Header
