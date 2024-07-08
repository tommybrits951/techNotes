import { Link } from "react-router-dom";

export default function Public() {
  
  const content = (
     <section className="public">
      <header>
        <h1>Welcome to <span className="nowrap">Tom's repairs!</span></h1>
      </header>
      <main className="public__main">
        <p>Located in beautiful downtown Moreno Valley. We provide a trained staff ready to meet your tech repair needs.</p>
        <address className="public__addr">
          Tom's Repair<br/>
          555 Sunnymead Blvd.<br/>
          Moreno Valley, CA 92553
        </address>
        <br />
        <p>Owner: Tommy Brits</p>
      </main>
      <footer>
        <Link to={'/login'}>Employee Login</Link>
      </footer>
    </section>
  )
  return content
}
