<form className="auth-form" onSubmit={(e) => {
  e.preventDefault();
  const username = e.target.username.value;
  const password = e.target.password.value;
  alert(`Logging in as ${username}`);
}}>
  <input type="text" name="username" placeholder="Username" required />
  <input type="password" name="password" placeholder="Password" required />
  <button className="btn-secondary">Login</button>
  <p>New here? <a href="#">Register</a></p>
</form>
