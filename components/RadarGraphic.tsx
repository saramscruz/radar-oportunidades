// Motivo visual central da marca — anéis concêntricos + varrimento, tal como
// já estabelecido no produto ao vivo (chana79900.softr.app). Usado como
// elemento de destaque na página de convite; deliberadamente não repetido
// nas páginas internas (registo/login/feed) para não competir com o
// conteúdo funcional aí.
export default function RadarGraphic() {
  return (
    <svg
      width="220"
      height="220"
      viewBox="0 0 220 220"
      role="img"
      aria-label="Ilustração de radar com dois avisos assinalados"
    >
      <defs>
        <radialGradient id="sweep" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="110" cy="110" r="95" fill="none" stroke="#1E3350" strokeWidth="1" />
      <circle cx="110" cy="110" r="65" fill="none" stroke="#1E3350" strokeWidth="1" />
      <circle cx="110" cy="110" r="35" fill="none" stroke="#1E3350" strokeWidth="1" />
      <path d="M 110 110 L 110 15 A 95 95 0 0 1 175 45 Z" fill="url(#sweep)" />
      <circle cx="110" cy="110" r="3" fill="#2DD4BF" />
      <circle cx="150" cy="60" r="3.5" fill="#2DD4BF" />
      <text x="158" y="58" fontSize="9" fill="#5EEAD4" fontWeight="600">
        Novo aviso
      </text>
      <circle cx="80" cy="165" r="3.5" fill="#2DD4BF" />
      <text x="20" y="182" fontSize="9" fill="#5EEAD4" fontWeight="600">
        Prazo em 5 dias
      </text>
    </svg>
  );
}
