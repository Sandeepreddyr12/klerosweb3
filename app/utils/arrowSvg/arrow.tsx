
const curvedArrowSvg = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" {...props}>
    <path
      fill="none"
      stroke="hsl(227, 71%, 57%)"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={25}
      markerEnd="url(#a)"
      d="M250 250q200 100 300 300"
      transform="rotate(252 400 400)"
    />
    <defs>
      <marker
        id="a"
        markerHeight={5}
        markerWidth={5}
        orient="auto"
        refX={2.5}
        refY={2.5}
        viewBox="0 0 5 5"
      >
        <path fill="hsl(227, 71%, 57%)" d="m0 5 2.5-2.5L0 0l5 2.5z" />
      </marker>
    </defs>
  </svg>
);
export default curvedArrowSvg;


export const StraightArrowSvg = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" {...props}>
    <path
      fill="none"
      stroke="hsl(227, 71%, 57%)"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={20}
      markerEnd="url(#a)"
      d="m132 132 536 536"
      transform="translate(-35)"
    />
    <defs>
      <marker
        id="a"
        markerHeight={3}
        markerWidth={3}
        orient="auto"
        refX={1.5}
        refY={1.5}
        viewBox="0 0 3 3"
      >
        <path
          fill="none"
          stroke="hsl(227, 71%, 57%)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={0.5}
          d="M.5 2.25 2 1.5.5.75"
        />
      </marker>
    </defs>
  </svg>
);


