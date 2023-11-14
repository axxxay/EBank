import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {userId: '', pin: '', errorMsg: ''}

  onChangeUserID = event => {
    this.setState({userId: event.target.value})
  }

  onChangePin = event => {
    this.setState({pin: event.target.value})
  }

  onClickLogin = async event => {
    event.preventDefault()
    const {userId, pin} = this.state
    if (userId === '' && pin === '') {
      this.setState({errorMsg: 'Please enter User ID and PIN'})
    } else if (userId === '') {
      this.setState({errorMsg: 'Please enter User ID'})
    } else if (pin === '') {
      this.setState({errorMsg: 'Please enter PIN'})
    } else {
      const loginDetails = {
        user_id: userId,
        pin,
      }
      const url = 'https://apis.ccbp.in/ebank/login'
      const options = {
        method: 'POST',
        body: JSON.stringify(loginDetails),
      }
      const response = await fetch(url, options)
      const data = await response.json()
      if (response.ok === true) {
        Cookies.set('jwt_token', data.jwt_token, {expires: 30})
        const {history} = this.props
        this.setState({userId: '', pin: '', errorMsg: ''})
        history.replace('/')
      } else {
        this.setState({errorMsg: data.error_msg})
      }
    }
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    const {userId, pin, errorMsg} = this.state
    return (
      <div className="login-container">
        <div className="login-card">
          <img
            src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
            alt="website login"
            className="login-image"
          />
          <form onSubmit={this.onClickLogin} className="login-content">
            <h1 className="login-heading">Welcome Back!</h1>
            <label className="label" htmlFor="user-id">
              User ID
            </label>
            <input
              type="text"
              id="user-id"
              placeholder="Enter User ID"
              className="input-box"
              onChange={this.onChangeUserID}
              value={userId}
            />
            <label className="label" htmlFor="password">
              PIN
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter PIN"
              className="input-box"
              onChange={this.onChangePin}
              value={pin}
            />
            <button type="submit" className="login-button">
              Login
            </button>
            <p className="error">*{errorMsg}</p>
          </form>
        </div>
      </div>
    )
  }
}

export default Login
