const FancySubmitButton = () => {
  return (
    <div className="inline rounded-full border-2 border-violet-600 shadow-md shadow-black ">
      <svg
        width="121"
        height="47"
        viewBox="0 0 121 47"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        Submit
        <path
          d="M1.5 23.5C1.5 11.3497 11.3497 1.5 23.5 1.5H97.5C109.65 1.5 119.5 11.3497 119.5 23.5C119.5 35.6503 109.65 45.5 97.5 45.5H23.5C11.3497 45.5 1.5 35.6503 1.5 23.5Z"
          fill="url(#paint0_linear_248_3394)"
          stroke="white"
          stroke-width="3"
        />
        <defs>
          <linearGradient
            id="paint0_linear_248_3394"
            x1="12"
            y1="24"
            x2="113"
            y2="24"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#A178F8" stop-opacity="0.55" />
            <stop offset="0.323612" stop-color="#7538F7" stop-opacity="0.46" />
            <stop offset="0.579188" stop-color="#550BF1" stop-opacity="0.53" />
            <stop offset="0.964645" stop-color="#C721B6" stop-opacity="0.52" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

export default FancySubmitButton
