type GardenOrnamentVariant =
  | "vine"
  | "bellflower"
  | "curlflower"
  | "wildflower";

type GardenOrnamentProps = {
  variant?: GardenOrnamentVariant;
  className?: string;
};

export default function GardenOrnament({
  variant = "vine",
  className = "",
}: GardenOrnamentProps) {

  if (variant === "bellflower") {
    return (
      <svg
        className={`garden-ornament garden-ornament-bellflower ${className}`.trim()}
        viewBox="0 0 180 220"
        aria-hidden="true"
      >
        <path className="garden-ornament-stem" d="M88 214C87 165 95 123 121 76C137 48 145 26 142 8" />
        <path className="garden-ornament-leaf" d="M93 165C58 153 40 126 42 96C72 104 91 126 93 165Z" />
        <path className="garden-ornament-leaf garden-ornament-leaf-alt" d="M111 111C135 101 155 82 164 58C137 60 118 77 111 111Z" />
        <path className="garden-ornament-flower garden-ornament-flower-blue" d="M116 78C94 72 82 54 86 35C104 39 116 50 121 67C127 50 141 40 159 40C159 61 145 76 116 78Z" />
        <path className="garden-ornament-flower garden-ornament-flower-pink" d="M69 126C50 116 42 99 47 84C62 88 72 98 76 112C82 99 93 92 108 94C106 111 94 122 69 126Z" />
        <circle className="garden-ornament-dot" cx="122" cy="74" r="3" />
        <circle className="garden-ornament-dot garden-ornament-dot-pink" cx="74" cy="122" r="2.6" />
      </svg>
    );
  }


  if (variant === "curlflower") {
    return (
      <svg
        className={`garden-ornament garden-ornament-curlflower ${className}`.trim()}
        viewBox="0 0 240 180"
        aria-hidden="true"
      >
        <path className="garden-ornament-stem" d="M8 164C54 154 72 128 77 94C83 57 107 34 149 31C186 28 218 47 232 74" />
        <path className="garden-ornament-stem garden-ornament-stem-soft" d="M43 154C74 143 97 146 119 160" />
        <path className="garden-ornament-leaf" d="M75 112C49 106 31 89 27 67C51 68 70 84 75 112Z" />
        <path className="garden-ornament-leaf garden-ornament-leaf-alt" d="M135 40C119 18 96 10 74 15C86 36 106 45 135 40Z" />
        <path className="garden-ornament-flower garden-ornament-flower-gold" d="M173 35C169 19 178 6 194 4C205 15 203 31 190 42C206 41 219 50 222 65C209 75 191 69 181 52C174 67 158 73 144 67C144 51 155 39 173 35Z" />
        <circle className="garden-ornament-dot garden-ornament-dot-gold" cx="181" cy="43" r="4" />
      </svg>
    );
  }


  return null;
}


export type { GardenOrnamentVariant };