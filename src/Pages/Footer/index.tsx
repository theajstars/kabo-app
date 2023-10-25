import "./styles.scss";

export default function Footer() {
  return (
    <div className="footer-container flex-row align-center width-100 justify-center">
      <b>&copy;</b>&nbsp; {new Date().getFullYear()} - Kabo.
    </div>
  );
}
