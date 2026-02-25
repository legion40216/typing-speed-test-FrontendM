import logo from "../../../assets/logo-large.svg";
import logoSmall from "../../../assets/logo-small.svg";

export default function NavLeft() {
  return (
    <div>
      <picture>
        <source media="(min-width: 768px)" srcSet={logo} />
        <img src={logoSmall} alt="Logo" className="w-auto h-8 md:h-10" />
      </picture>
    </div>
  );
}